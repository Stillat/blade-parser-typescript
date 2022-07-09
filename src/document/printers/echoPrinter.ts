import { BladeEchoNode, BladeEntitiesEchoNode, BladeEscapedEchoNode } from '../../nodes/nodes';
import { StringUtilities } from '../../utilities/stringUtilities';
import { PhpFormatter } from '../transformer';

export class EchoPrinter {
    static printEcho(echo: BladeEchoNode, phpFormatter: PhpFormatter | null): string {
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

        if (phpFormatter != null && echo.hasValidPhp()) {
            let tResult = phpFormatter('<?php ' + innerContent);
            tResult = StringUtilities.replaceAllInString(tResult, "\n", ' ');

            innerContent = tResult;
        }

        result += innerContent + end;

        return result;
    }
}