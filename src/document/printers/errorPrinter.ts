import { BladeError } from '../../errors/bladeError.js';

export class ErrorPrinter {
    static printError(error: BladeError, lines: Map<number, string>): string {
        let result = error.message + "\n\n",
            line = error.node?.startPosition?.line as number;

        let maxLine = line;

        lines.forEach((text, lineNumber) => {
            maxLine = lineNumber;
        });

        let maxLineLen = maxLine.toString().length;

        lines.forEach((lineText, lineNumber) => {
            let curLineString = lineNumber.toString(),
                prefix = '',
                linePaddingLen = 0;

            linePaddingLen = maxLineLen - curLineString.length;

            if (line == lineNumber) {
                prefix = ' >' + '0'.repeat(linePaddingLen) + curLineString + '| ';
            } else {
                prefix = '  ' + '0'.repeat(linePaddingLen) + curLineString + '| ';
            }

            result += prefix + lineText + "\n";
        });


        return result;
    }
}