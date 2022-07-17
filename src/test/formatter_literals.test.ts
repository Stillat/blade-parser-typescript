import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Format Literals', () => {
    test('simple text is returned', () => {
        assert.strictEqual(formatBladeString('just some text'), "just some text\n");
    });

    test('simple HTML is returned', () => {
        assert.strictEqual(formatBladeString('<p>Some HTML</p>'), "<p>Some HTML</p>\n");
    });
});