import { Engine } from 'php-parser';
import { PhpValidator } from './phpValidator.js';

export class PhpParserPhpValidator  implements PhpValidator {
    private lastError: SyntaxError | null = null;

    isValid(template: string, isEval = true): boolean {
        const parser = new Engine({
            parser: {
                extractDoc: true,
            },
            ast: {
                withPositions: true,
                withSource: true,
            },
        });

        try {
            if (isEval) {
                parser.parseEval(template);
            } else {
                parser.parseCode(template, 'test.php');
            }
        } catch (err) {
            if (err instanceof SyntaxError) {
                this.lastError = err;
            }

            return false;
        }

        this.lastError = null;

        return true;
    }
    getLastError(): SyntaxError | null {
        return this.lastError;
    }
    
}