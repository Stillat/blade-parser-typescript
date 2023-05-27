import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Literals', () => {
    test('pint: simple text is returned', () => {
        assert.strictEqual(formatBladeStringWithPint('just some text'), "just some text\n");
    });

    test('pint: simple HTML is returned', () => {
        assert.strictEqual(formatBladeStringWithPint('<p>Some HTML</p>'), "<p>Some HTML</p>\n");
    });
});