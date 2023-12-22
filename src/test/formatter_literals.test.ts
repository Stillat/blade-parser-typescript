import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Format Literals', () => {
    test('simple text is returned', async () => {
        assert.strictEqual(await formatBladeString('just some text'), "just some text\n");
    });

    test('simple HTML is returned', async () => {
        assert.strictEqual(await formatBladeString('<p>Some HTML</p>'), "<p>Some HTML</p>\n");
    });
});