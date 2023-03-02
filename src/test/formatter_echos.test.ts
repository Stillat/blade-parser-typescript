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

    test('test formatting inline echo arrays does not add extra whitespace', () => {
        const input = `<a
href="#"
target="_blank"
{{ $attributes->merge(["class" => "rounded transition focus-visible:outline-none focus-visible:ring focus-visible:ring-red-600"]) }}
>
Some link
</a>`;
        const expected = `<a
    href="#"
    target="_blank"
    {{ $attributes->merge(["class" => "rounded transition focus-visible:outline-none focus-visible:ring focus-visible:ring-red-600"]) }}
>
    Some link
</a>`;
        assert.strictEqual(formatBladeString(input).trim(), expected);
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