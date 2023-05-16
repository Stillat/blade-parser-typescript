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

export class DirectivePrinter {
    private static defaultControlDirectiveNames: string[] = [
        'if', 'elseif', 'unless', 'while', 'for', 'foreach', 'forelse'
    ];

    // Speculative conditions are those that are discovered
    // while analyzing how the directives are used within
    // a template. This list helps prevent some Core
    // directives from having additional spaces.
    private static ignoreSpeculativeConditions: string[] = [
        'can', 'canany', 'elsecan', 'elsecanany', 'cannot',
    ];

    private static getReasonableDirectivePhpOptions(directive: DirectiveNode, phpOptions:ParserOptions): ParserOptions {
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

    static printDirective(directive: DirectiveNode, options: TransformOptions, phpFormatter: PhpFormatter | null, jsonFormatter: JsonFormatter | null, indentLevel: number): string {
        let directiveName = directive.directiveName.trim(),
            result = '@' + directiveName;

        if (directive.hasDirectiveParameters) {
            let paramContent = directive.directiveParameters;

            if (!directive.hasJsonParameters) {
                if (options.formatDirectivePhpParameters && phpFormatter != null && directive.hasValidPhp()) {
                    let params = directive.getPhpContent().trim();
                    if (params.startsWith('(') && params.endsWith(')')) {
                        params = params.substring(1);
                        params = params.substring(0, params.length - 1);
                    }

                    let tResult = params,
                        removeLines = false;

                    if (params.startsWith('[') && params.endsWith(']') && directive.startPosition?.line != directive.endPosition?.line) {
                        tResult = phpFormatter('<?php ' + params, options, DirectivePrinter.getReasonableDirectivePhpOptions(directive, getPhpOptions()));

                        const arrayParser = new SimpleArrayParser(),
                            array = arrayParser.parse(StringUtilities.replaceAllInString(tResult, "\n", ' ')),
                            targetIndent = 0;

                        if (arrayParser.getIsAssoc() || tResult.includes('match')) {
                            if (tResult.includes("\n") && !removeLines) {
                                tResult = IndentLevel.shiftIndent(
                                    tResult,
                                    indentLevel,
                                    true
                                );
                            }

                            tResult = '@' + directiveName + ' '.repeat(options.spacesAfterDirective) + '(' + tResult + ')';
                        } else {
                            if (array != null) {
                                tResult = ArrayPrinter.print(array, options.tabSize, 1);

                                if (targetIndent > 0) {
                                    tResult = StringUtilities.removeEmptyNewLines(IndentLevel.shiftIndent(tResult, targetIndent, true));
                                }

                                if (tResult.includes("\n") && !removeLines) {
                                    tResult = IndentLevel.shiftIndent(
                                        tResult,
                                        indentLevel,
                                        true
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
                            true
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

                    const tResult = jsonFormatter(params);

                    paramContent = '(' + tResult + ')';
                }
            }

            let spacesToUse = options.spacesAfterDirective;

            if (DirectivePrinter.defaultControlDirectiveNames.includes(directiveName) ||
                (! DirectivePrinter.ignoreSpeculativeConditions.includes(directiveName) &&
                    DirectivePrinter.defaultControlDirectiveNames.includes(directive.name))) {
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