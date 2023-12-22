import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Echo Transformer', () => {
    test('it transforms echos', async () => {
        assert.strictEqual(
            (await transformString(`
<p>test {{ $title }} test

asdfasdf </p>

<p>
{{ $test }}
</p>`)).trim(),
            `<p>test {{ $title }} test

asdfasdf </p>

<p>
{{ $test }}
</p>`
        );
    });
});