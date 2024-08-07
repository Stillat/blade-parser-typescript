import assert from 'assert';
import { ParenUnwrapper } from '../parser/parenUnwrapper.js';

suite('Parenthesis Unwrapper', () => {
    test('it removes trailing/leading parens', () => {
        const unwrapper = new ParenUnwrapper();

        assert.strictEqual(unwrapper.unwrap('(test)'), 'test');
        assert.strictEqual(unwrapper.unwrap('((test))'), 'test');
        assert.strictEqual(unwrapper.unwrap('((test) || (test))'), '(test) || (test)');
        assert.strictEqual(unwrapper.unwrap('(("test") || (\'(test\'))'), '("test") || (\'(test\')');
    });
});