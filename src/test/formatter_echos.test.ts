import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Echo Formatting', () => {
    test('it formats valid PHP code', () => {
        assert.strictEqual(
            formatBladeString('{{$test   +$that}}').trim(),
            '{{ $test + $that }}'
        );
    });

    test('it formats valid PHP code in {!!', () => {
        assert.strictEqual(
            formatBladeString('{!!$test   +$that!!}').trim(),
            '{!! $test + $that !!}'
        );
    });

    test('it formats valid PHP code in {{{', () => {
        assert.strictEqual(
            formatBladeString('{{{$test   +$that}}}').trim(),
            '{{{ $test + $that }}}'
        );
    });

    test('it ingores invalid PHP code', () => {
        assert.strictEqual(
            formatBladeString('{{$test   $+++$that}}').trim(),
            '{{ $test   $+++$that }}'
        );
    });

    test('it ignores invalid PHP code in {!!', () => {
        assert.strictEqual(
            formatBladeString('{!!$test   $+++$that!!}').trim(),
            '{!! $test   $+++$that !!}'
        );
    });

    test('it ignores invalid PHP code in {{{', () => {
        assert.strictEqual(
            formatBladeString('{{{$test   $+++$that}}}').trim(),
            '{{{ $test   $+++$that }}}'
        );
    });

    test('it can format inline echos as text', () => {
        assert.strictEqual(
            formatBladeString(`
            <p>test {{ $title }} test
            
            asdfasdf </p>

            <p>
        {{ $test }}
        </p>`).trim(),
            `<p>test {{ $title }} test asdfasdf</p>

<p>
    {{ $test }}
</p>`
        );
    });
});