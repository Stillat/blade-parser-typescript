import { PhpOperatorReflow } from '../../formatting/phpOperatorReflow';
import { getEchoPhpOptions } from '../../formatting/prettier/utils';
import { SyntaxReflow } from '../../formatting/syntaxReflow';
import { BladeEchoNode, BladeEntitiesEchoNode, BladeEscapedEchoNode } from '../../nodes/nodes';
import { PhpFormatter } from '../formatters';
import { TransformOptions } from '../transformOptions';
import { IndentLevel } from './indentLevel';

export class EchoPrinter {
    static printEcho(echo: BladeEchoNode, formattingOptions:TransformOptions, phpFormatter: PhpFormatter | null, indentLevel: number): string {
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
                        printWidth: 45
                    };
                    
                    tResult = phpFormatter('<?php ' + innerContent, formattingOptions, echoOptions);
    
                    if (PhpOperatorReflow.couldReflow(tResult)) {
                        tResult = PhpOperatorReflow.instance.reflow(tResult);
                    }

                    if (SyntaxReflow.couldReflow(tResult)) {
                        tResult = SyntaxReflow.instance.reflow(tResult);
                    }

                    const relativeIndent = start.trim() + "\n" + IndentLevel.shiftIndent(
                        tResult,
                        indentLevel + formattingOptions.tabSize,
                        false
                    ) + "\n" + ' '.repeat(indentLevel) + end.trim();

                    return relativeIndent;
                } else {
                    tResult = phpFormatter('<?php ' + innerContent, formattingOptions, echoOptions);
    
                    if (PhpOperatorReflow.couldReflow(tResult)) {
                        tResult = PhpOperatorReflow.instance.reflow(tResult);
                    }

                    if (SyntaxReflow.couldReflow(tResult)) {
                        tResult = SyntaxReflow.instance.reflow(tResult);
                    }
                }

                innerContent = tResult;
            }
        }        

        result += innerContent + end;

        return result;
    }
}