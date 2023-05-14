import { PhpOperatorReflow } from '../../formatting/phpOperatorReflow';
import { BladeEchoNode, BladeEntitiesEchoNode, BladeEscapedEchoNode } from '../../nodes/nodes';
import { StringUtilities } from '../../utilities/stringUtilities';
import { PhpFormatter } from '../formatters';
import { TransformOptions } from '../transformOptions';

export class EchoPrinter {
    static printEcho(echo: BladeEchoNode, formattingOptions:TransformOptions, phpFormatter: PhpFormatter | null): string {
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
                let tResult = phpFormatter('<?php ' + innerContent);
                tResult = StringUtilities.replaceAllInString(tResult, "\n", ' ');
    
                if (PhpOperatorReflow.couldReflow(tResult)) {
                    tResult = PhpOperatorReflow.instance.reflow(tResult);
                }

                innerContent = tResult;
            }
        }        

        result += innerContent + end;

        return result;
    }
}