import assert from 'assert';
import { PhpValidator } from '../parser/php/phpValidator';
import { assertNotNull } from './testUtils/assertions';

suite('PHP Validator', () => {
    test('it detects invalid php', () => {
        const isValid = PhpValidator.isValid(` $this+++++DS_F`),
            error = PhpValidator.lastError;

        assertNotNull(error);
        assert.strictEqual(isValid, false);
        assert.strictEqual(error?.message, "Parse Error : syntax error, unexpected '++' (T_INC), expecting ';' on line 1");
    });

    test('it detects valid php', () => {
        assert.strictEqual(PhpValidator.isValid('$attributes'), true);
        assert.strictEqual(PhpValidator.lastError, null);
    });
});