import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('Echo Transformer', () => {
    test('it transforms echos', () => {
        assert.strictEqual(
            transformString(`
<p>test {{ $title }} test

asdfasdf </p>

<p>
{{ $test }}
</p>`).trim(),
            `<p>test {{ $title }} test

asdfasdf </p>

<p>
{{ $test }}
</p>`
        );
    });
});