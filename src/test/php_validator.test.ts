import assert from 'assert';
import { PhpParserPhpValidator } from '../parser/php/phpParserPhpValidator.js';
import { assertNotNull } from './testUtils/assertions.js';

suite('PHP Validator', () => {
    test('it detects invalid php', () => {
        const validator = new PhpParserPhpValidator(),
            isValid = validator.isValid(` $this+++++DS_F`),
            error = validator.getLastError();

        assertNotNull(error);
        assert.strictEqual(isValid, false);
        assert.strictEqual(error?.message, "Parse Error : syntax error, unexpected '++' (T_INC), expecting ';' on line 1");
    });

    test('it detects valid php', () => {
        const validator = new PhpParserPhpValidator();

        assert.strictEqual(validator.isValid('$attributes'), true);
        assert.strictEqual(validator.getLastError(), null);
    });
});