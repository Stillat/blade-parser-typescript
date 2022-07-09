import { Engine } from 'php-parser';

export class PhpValidator {
    static lastError: SyntaxError | null = null;
    static isValid(template: string, isEval = true): boolean {
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
                PhpValidator.lastError = err;
            }

            return false;
        }

        PhpValidator.lastError = null;

        return true;
    }
}