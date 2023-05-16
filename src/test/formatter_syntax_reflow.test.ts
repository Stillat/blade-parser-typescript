import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Directives Formatting', () => {
    test('it reflows arrow functions', () => {
        const expected = `{{ fn () => "foo" }}`;
        assert.strictEqual(formatBladeString( `{{ fn () => 'foo' }}`).trim(), expected);
        assert.strictEqual(formatBladeString( `{{ fn() => 'foo' }}`).trim(), expected);
        assert.strictEqual(formatBladeString( `{{ fn()=> 'foo' }}`).trim(), expected);
    });
});