import { GeneralSyntaxReflow } from '../../formatting/generalSyntaxReflow.js';
import { getEchoPhpOptions } from '../../formatting/prettier/utils.js';
import { SyntaxReflow } from '../../formatting/syntaxReflow.js';
import { BladeEchoNode, BladeEntitiesEchoNode, BladeEscapedEchoNode } from '../../nodes/nodes.js';
import { StringUtilities } from '../../utilities/stringUtilities.js';
import { PhpFormatter } from '../formatters.js';
import { PintTransformer } from '../pintTransformer.js';
import { TransformOptions } from '../transformOptions.js';
import { IndentLevel } from './indentLevel.js';
import { getPrintWidth, preparePrettierWorkaround, undoPrettierWorkaround } from './printWidthUtils.js';

export class EchoPrinter {
    static async printEcho(
        echo: BladeEchoNode,
        formattingOptions: TransformOptions,
        phpFormatter: PhpFormatter | null,
        indentLevel: number,
        pintTransformer: PintTransformer | null
    ): Promise<string> {
        let start = '{{ ',
            end = ' }}';

        if (echo instanceof BladeEscapedEchoNode) {
            start = '{!! ';
            end = ' !!}';
        } else if (echo instanceof BladeEntitiesEchoNode) {
            start = '{{{ ';
            end = ' }}}';
        }

        let result = start;

        let innerContent = echo.content.trim();

        if (formattingOptions.formatInsideEcho) {
            if (phpFormatter != null && echo.hasValidPhp()) {
                let echoOptions = getEchoPhpOptions(),
                    tResult = innerContent;

                if (echo.startPosition?.line != echo.endPosition?.line) {
                    echoOptions = {
                        ...echoOptions,
                        printWidth: getPrintWidth(innerContent, echoOptions.printWidth)
                    };

                    if (formattingOptions.useLaravelPint) {
                        if (pintTransformer != null) {
                            tResult = pintTransformer.getEchoContent(echo);
                        }
                    } else {
                        const lineWrapWorkaround = preparePrettierWorkaround(innerContent);

                        if (lineWrapWorkaround.addedHack) {
                            innerContent = lineWrapWorkaround.content;
                        }

                        tResult = await phpFormatter('<?php ' + innerContent, formattingOptions, echoOptions);

                        if (lineWrapWorkaround.addedHack) {
                            tResult = undoPrettierWorkaround(tResult);
                        }

                        if (GeneralSyntaxReflow.couldReflow(tResult)) {
                            tResult = GeneralSyntaxReflow.instance.reflow(tResult);
                        }

                        if (SyntaxReflow.couldReflow(tResult)) {
                            tResult = SyntaxReflow.instance.reflow(tResult);
                        }
                    }

                    if (formattingOptions.echoStyle == 'inline') {

                        const inlineIndentResult = IndentLevel.shiftIndentWithLastLineInline(
                            tResult,
                            formattingOptions.tabSize,
                            indentLevel + formattingOptions.tabSize,
                            true
                        ).trim();

                        const inlineRelativeIndent = start.trimRight() + ' ' + inlineIndentResult + ' ' + end.trim();

                        return inlineRelativeIndent;
                    }

                    const relativeIndent = start.trim() + "\n" + IndentLevel.shiftIndent(
                        tResult,
                        indentLevel + formattingOptions.tabSize,
                        false,
                        formattingOptions,
                        true
                    ) + "\n" + ' '.repeat(indentLevel) + end.trim();

                    return relativeIndent;
                } else {
                    if (formattingOptions.useLaravelPint) {
                        if (pintTransformer != null) {
                            tResult = pintTransformer.getEchoContent(echo);
                        }
                    } else {
                        tResult = await phpFormatter('<?php ' + innerContent + ';', formattingOptions, { ...echoOptions, printWidth: Infinity });
                        tResult = tResult.trimRight().substring(0, tResult.trimRight().length - 1);
                        if (GeneralSyntaxReflow.couldReflow(tResult)) {
                            tResult = GeneralSyntaxReflow.instance.reflow(tResult);
                        }

                        if (SyntaxReflow.couldReflow(tResult)) {
                            tResult = SyntaxReflow.instance.reflow(tResult);
                        }
                    }

                    // Handle the case if prettier added newlines anyway.
                    if (tResult.includes("\n")) {
                        tResult = StringUtilities.collapse(tResult);
                    }
                }

                innerContent = tResult;
            }
        }

        result += innerContent + end;

        return result;
    }
}
