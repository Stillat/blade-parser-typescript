import { PhpOperatorReflow } from '../../formatting/phpOperatorReflow';
import { getPhpOptions } from '../../formatting/prettier/utils';
import { SyntaxReflow } from '../../formatting/syntaxReflow';
import { DirectiveNode } from '../../nodes/nodes';
import { SimpleArrayParser } from '../../parser/simpleArrayParser';
import { StringUtilities } from '../../utilities/stringUtilities';
import { JsonFormatter, PhpFormatter } from '../formatters';
import { TransformOptions } from '../transformOptions';
import { ArrayPrinter } from './arrayPrinter';
import { IndentLevel } from './indentLevel';
import { ParserOptions } from "prettier";
import { getPrintWidth, preparePrettierWorkaround, undoPrettierWorkaround } from './printWidthUtils';
import { PintTransformer } from '../pintTransformer';

export class DirectivePrinter {
    private static defaultControlDirectiveNames: string[] = [
        'if', 'elseif', 'unless', 'while', 'for', 'foreach', 'forelse'
    ];

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

    static printDirective(
        directive: DirectiveNode,
        options: TransformOptions,
        phpFormatter: PhpFormatter | null,
        jsonFormatter: JsonFormatter | null,
        indentLevel: number,
        pintTransformer: PintTransformer | null
    ): string {
        let directiveName = directive.directiveName.trim(),
            result = '@' + directiveName;

        if (directive.hasDirectiveParameters) {
            let paramContent = directive.directiveParameters;

            if (!directive.hasJsonParameters) {
                if (options.formatDirectivePhpParameters && phpFormatter != null && directive.hasValidPhp()) {

                    if (pintTransformer != null) {
                        let tResult = pintTransformer.getDirectiveContent(directive);

                        tResult = IndentLevel.shiftIndent(
                            tResult,
                            indentLevel,
                            true,
                            options
                        );

                        let spacesToUse = options.spacesAfterDirective;

                        if (DirectivePrinter.defaultControlDirectiveNames.includes(directiveName)) {
                            spacesToUse = options.spacesAfterControlDirective;
                        }

                        if (tResult.startsWith('(') && tResult.endsWith(')')) {
                            tResult = tResult.substring(1, tResult.length - 1);
                        }

                        return '@' + directiveName + ' '.repeat(spacesToUse) + '(' + tResult + ')';
                    }

                    let params = directive.getPhpContent().trim();
                    if (params.startsWith('(') && params.endsWith(')')) {
                        params = params.substring(1);
                        params = params.substring(0, params.length - 1);
                    }

                    let tResult = params,
                        removeLines = false;

                    const phpOptions = getPhpOptions();
                    if (params.startsWith('[') && params.endsWith(']') && directive.startPosition?.line != directive.endPosition?.line) {
                        let phpInput = '<?php ' + params;
                        const lineWrapWorkaround = preparePrettierWorkaround(phpInput);

                        if (lineWrapWorkaround.addedHack) {
                            phpInput = lineWrapWorkaround.content;
                        }

                        tResult = phpFormatter(phpInput, options, DirectivePrinter.getReasonableDirectivePhpOptions(directive, {
                            ...phpOptions,
                            printWidth: getPrintWidth(params, phpOptions.printWidth)
                        }));

                        if (lineWrapWorkaround.addedHack) {
                            tResult = undoPrettierWorkaround(tResult);
                        }

                        const arrayParser = new SimpleArrayParser(),
                            array = arrayParser.parse(StringUtilities.replaceAllInString(tResult, "\n", ' ')),
                            targetIndent = 0;

                        if (arrayParser.getIsAssoc() || tResult.includes('match') || tResult.includes('=>' || tResult.includes('&&'))) {
                            if (tResult.includes("\n") && !removeLines) {
                                tResult = IndentLevel.shiftIndent(
                                    tResult,
                                    indentLevel,
                                    true,
                                    options
                                );
                            }

                            if (PhpOperatorReflow.couldReflow(tResult)) {
                                tResult = PhpOperatorReflow.instance.reflow(tResult);
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

                            tResult = phpFormatter('<?php ' + params, options, DirectivePrinter.getReasonableDirectivePhpOptions(directive, formatOptions))
                        } catch (err) {
                            // Prevent PHP errors from crashing formatter.
                        }
                    }

                    if (directive.directiveName.toLowerCase() == 'forelse') {
                        tResult = tResult.substring(9);
                        tResult = tResult.substring(0, tResult.length - 14);
                    }

                    if (PhpOperatorReflow.couldReflow(tResult)) {
                        tResult = PhpOperatorReflow.instance.reflow(tResult);
                    }

                    if (SyntaxReflow.couldReflow(tResult)) {
                        tResult = SyntaxReflow.instance.reflow(tResult);
                    }

                    if (tResult.includes("\n") && !removeLines) {
                        paramContent = '(' + IndentLevel.shiftIndent(
                            tResult,
                            indentLevel,
                            true,
                            options
                        ) + ')';
                    } else {
                        if (removeLines) {
                            tResult = removeContentLines(tResult);
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

                    let tResult = jsonFormatter(params);

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

function removeContentLines(content: string): string {
    let newContent = '';
    const lines = StringUtilities.breakByNewLine(content);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        newContent += line.trim();
    }

    return newContent;
}

