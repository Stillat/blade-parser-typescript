import { getPhpOptions } from '../../formatting/prettier/utils.js';
import { SyntaxReflow } from '../../formatting/syntaxReflow.js';
import { DirectiveNode } from '../../nodes/nodes.js';
import { SimpleArrayParser } from '../../parser/simpleArrayParser.js';
import { StringUtilities } from '../../utilities/stringUtilities.js';
import { JsonFormatter, PhpFormatter } from '../formatters.js';
import { TransformOptions } from '../transformOptions.js';
import { ArrayPrinter } from './arrayPrinter.js';
import { IndentLevel } from './indentLevel.js';
import { ParserOptions } from "prettier";
import { getPrintWidth, preparePrettierWorkaround, undoPrettierWorkaround } from './printWidthUtils.js';
import { PintTransformer } from '../pintTransformer.js';
import { GeneralSyntaxReflow } from '../../formatting/generalSyntaxReflow.js';
import { ParenUnwrapper } from '../../parser/parenUnwrapper.js';

export class DirectivePrinter {
    private static defaultControlDirectiveNames: string[] = [
        'if', 'elseif', 'unless', 'while', 'for', 'foreach', 'forelse'
    ];

    private static canUseSimpleParser(value: string): boolean {
        // Quick work around for now.
        // Likely remove the prettier workaround logic in the next major version to save headache.
        if (
            value.includes('//') || value.includes('/**') ||
            value.includes('?') || value.includes(':') ||
            (value.includes('(') && value.includes(')')) ||
            (value.includes('{') && value.includes('}'))
        ) {
            return false;
        }

        return true;
    }

    private static getReasonableDirectivePhpOptions(directive: DirectiveNode, phpOptions: ParserOptions): ParserOptions {
        // We will override the traillingCommaPHP setting within condition-like
        // directives; if we don't we end up with rather ugly @if(...) blocks
        // all over the place. However, we can't override this on all of
        // the directives, otherwise directives like @class look weird.
        if (DirectivePrinter.defaultControlDirectiveNames.includes(directive.name)) {
            return {
                ...phpOptions,
                trailingCommaPHP: false
            } as ParserOptions;
        }

        return phpOptions;
    }

    static async printDirective(
        directive: DirectiveNode,
        options: TransformOptions,
        phpFormatter: PhpFormatter | null,
        jsonFormatter: JsonFormatter | null,
        indentLevel: number,
        pintTransformer: PintTransformer | null
    ): Promise<string> {
        let directiveName = directive.directiveName.trim(),
            result = '@' + directiveName;

        if (directive.hasDirectiveParameters) {
            let paramContent = directive.directiveParameters;

            if (!directive.hasJsonParameters) {
                if (options.formatDirectivePhpParameters && phpFormatter != null && directive.hasValidPhp()) {

                    if (pintTransformer != null) {
                        let spacesToUse = options.spacesAfterDirective;

                        if (DirectivePrinter.defaultControlDirectiveNames.includes(directiveName)) {
                            spacesToUse = options.spacesAfterControlDirective;
                        }
                        const prefix = '@' + directiveName + ' '.repeat(spacesToUse);
                        let tResult = pintTransformer.getDirectiveContent(directive);

                        tResult = IndentLevel.shiftIndent(
                            tResult,
                            indentLevel,
                            true,
                            options
                        );

                        if (DirectivePrinter.defaultControlDirectiveNames.includes(directiveName) && tResult.includes("\n")) {
                            const nLines = StringUtilities.breakByNewLine(tResult),
                                reflowed: string[] = [];

                            for (let i = 0; i < nLines.length; i++) {
                                const line = nLines[i];
                                if (i == 0) {
                                    reflowed.push(line);
                                    continue;
                                }

                                reflowed.push(' '.repeat(prefix.length + 1) + line);
                            }

                            tResult = reflowed.join("\n");
                        }

                        return prefix + tResult;
                    }

                    let params = directive.getPhpContent().trim();
                    const parenUnwrapper = new ParenUnwrapper();
                    while (params.startsWith('(') && params.endsWith(')')) {
                        params = parenUnwrapper.unwrap(params);
                    }

                    let tResult = params,
                        removeLines = false,
                        trimShift = true;

                    const phpOptions = getPhpOptions();
                    if (
                            params.startsWith('[') && params.endsWith(']') && directive.startPosition?.line != directive.endPosition?.line &&
                            DirectivePrinter.canUseSimpleParser(params)
                        ) {
                        let phpInput = '<?php ' + params;
                        const lineWrapWorkaround = preparePrettierWorkaround(phpInput);

                        if (lineWrapWorkaround.addedHack) {
                            phpInput = lineWrapWorkaround.content;
                        }

                        tResult = await phpFormatter(phpInput, options, DirectivePrinter.getReasonableDirectivePhpOptions(directive, {
                            ...phpOptions,
                            printWidth: getPrintWidth(params, phpOptions.printWidth)
                        }));

                        if (lineWrapWorkaround.addedHack) {
                            tResult = undoPrettierWorkaround(tResult);
                        }

                        const arrayParser = new SimpleArrayParser(),
                            array = arrayParser.parse(StringUtilities.replaceAllInString(tResult, "\n", ' ')),
                            targetIndent = 0;

                        if (arrayParser.getIsAssoc() || tResult.includes('match') || tResult.includes('=>')  || tResult.includes('&&')) {
                            if (tResult.includes("\n") && !removeLines) {
                                tResult = IndentLevel.shiftIndent(
                                    tResult,
                                    indentLevel,
                                    true,
                                    options
                                );
                            }

                            if (GeneralSyntaxReflow.couldReflow(tResult)) {
                                tResult = GeneralSyntaxReflow.instance.reflow(tResult);
                            }

                            if (SyntaxReflow.couldReflow(tResult)) {
                                tResult = SyntaxReflow.instance.reflow(tResult);
                            }

                            tResult = '@' + directiveName + ' '.repeat(options.spacesAfterDirective) + '(' + tResult + ')';
                        } else {
                            if (array != null) {
                                tResult = ArrayPrinter.print(array, options.tabSize, 1);

                                if (targetIndent > 0) {
                                    tResult = StringUtilities.removeEmptyNewLines(IndentLevel.shiftIndent(tResult, targetIndent, true, options));
                                }

                                if (tResult.includes("\n") && !removeLines) {
                                    tResult = IndentLevel.shiftIndent(
                                        tResult,
                                        indentLevel,
                                        true,
                                        options
                                    );
                                }

                                tResult = '@' + directiveName + ' '.repeat(options.spacesAfterDirective) + '(' + tResult + ')';
                            }
                        }

                        return tResult;
                    } else {
                        try {
                            let formatOptions = getPhpOptions();
                            if (directive.startPosition?.line == directive.endPosition?.line) {
                                formatOptions = {
                                    ...getPhpOptions(),
                                    printWidth: Infinity
                                };
                                removeLines = true;
                            }

                            tResult = await phpFormatter('<?php ' + params, options, DirectivePrinter.getReasonableDirectivePhpOptions(directive, formatOptions))
                        } catch (err) {
                            // Prevent PHP errors from crashing formatter.
                        }
                    }

                    if (directive.directiveName.toLocaleLowerCase().match(/^for(each|else)$/)) {
                        tResult = tResult.substring(9);
                        tResult = tResult.substring(0, tResult.length - 14);
                    }

                    if (directive.getArgCount() > 1) {
                        let argTempResult = tResult;

                        if (argTempResult.startsWith('[') && argTempResult.endsWith('];')) {
                            argTempResult = tResult.substring(1, tResult.length - 2)
                        }

                        if (tResult.trimStart().startsWith('[') && tResult.trimEnd().endsWith('];')) {
                            trimShift = false;
                            argTempResult = "\n" + argTempResult.trimEnd();

                            if (argTempResult.endsWith(',')) {
                                argTempResult = argTempResult.substring(1, argTempResult.length - 1);
                                argTempResult += "\n";
                            }

                            tResult = argTempResult;
                        } else {
                            tResult = argTempResult;
                        }
                    }

                    if (GeneralSyntaxReflow.couldReflow(tResult)) {
                        tResult = GeneralSyntaxReflow.instance.reflow(tResult);
                    }

                    if (SyntaxReflow.couldReflow(tResult)) {
                        tResult = SyntaxReflow.instance.reflow(tResult);
                    }

                    if (tResult.includes("\n") && !removeLines) {
                        paramContent = '(' + IndentLevel.shiftIndent(
                            tResult,
                            indentLevel,
                            true,
                            options,
                            false,
                            false,
                            trimShift
                        );

                        if (! trimShift) {
                            // We want to add some leading whitespace.
                            paramContent += ' '.repeat(indentLevel);
                        }

                        paramContent += ')';
                    } else {
                        if (removeLines) {
                            tResult = removeContentLines(tResult, directive);
                        }

                        if (tResult.startsWith('(') && tResult.endsWith(')')) {
                            tResult = parenUnwrapper.unwrap(tResult);
                        }

                        paramContent = '(' + tResult + ')';
                    }
                }
            } else {
                if (options.formatDirectiveJsonParameters && jsonFormatter && directive.hasValidJson()) {
                    let params = directive.getPhpContent().trim();
                    if (params.startsWith('(') && params.endsWith(')')) {
                        params = params.substring(1);
                        params = params.substring(0, params.length - 1);
                    }

                    let tResult = await jsonFormatter(params);

                    if (tResult.includes("\n")) {
                        tResult = IndentLevel.shiftIndent(
                            tResult,
                            indentLevel,
                            true,
                            options
                        );
                    }

                    paramContent = '(' + tResult + ')';
                }
            }

            let spacesToUse = options.spacesAfterDirective;

            if (DirectivePrinter.defaultControlDirectiveNames.includes(directiveName)) {
                spacesToUse = options.spacesAfterControlDirective;
            }

            result += ' '.repeat(spacesToUse) + paramContent;
        }

        return result;
    }
}

function removeContentLines(content: string, directive: DirectiveNode): string {
    let newContent = '';
    const lines = StringUtilities.breakByNewLine(content);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const tmpLine = line.trim();

        if (
            (directive?.directiveName === 'foreach' || directive?.directiveName === 'forelse') && 
            (tmpLine === 'as' || tmpLine.startsWith('as '))
        ) {
            newContent += ' ';
        }

        newContent += tmpLine;
    }

    return newContent;
}
