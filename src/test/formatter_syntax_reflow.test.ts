import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Directives Formatting', () => {
    test('it reflows arrow functions', async () => {
        const expected = `{{ fn () => "foo" }}`;
        assert.strictEqual((await formatBladeString(`{{ fn () => 'foo' }}`)).trim(), expected);
        assert.strictEqual((await formatBladeString(`{{ fn() => 'foo' }}`)).trim(), expected);
        assert.strictEqual((await formatBladeString(`{{ fn()=> 'foo' }}`)).trim(), expected);
    });
});