import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Literals', () => {
    test('pint: simple text is returned', async () => {
        assert.strictEqual(await formatBladeStringWithPint('just some text'), "just some text\n");
    });

    test('pint: simple HTML is returned', async () => {
        assert.strictEqual(await formatBladeStringWithPint('<p>Some HTML</p>'), "<p>Some HTML</p>\n");
    });
});