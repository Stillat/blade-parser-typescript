import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Basic Nodes', () => {
    test('pint: it formats echos', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{ $title }}').trim(),
            "{{ $title }}"
        );
    });

    test('pint: it formats echo variant', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{{ $title }}}').trim(),
            "{{{ $title }}}"
        );
    });

    test('pint: it formats escaped echos', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{!! $title !!}').trim(),
            "{!! $title !!}"
        );
    });

    test('pint: it formats simple comments', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{-- Comment. --}}').trim(),
            "{{-- Comment. --}}"
        );
    });

    test('pint: it formats block comments', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`{{--
                Block Comment. --}}`).trim(),
            `{{--
    Block Comment.
--}}`
        );
    });

    test('pint: it formats block comments with', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`{{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}`),
            `{{--
    Block Comment.
    with many lines and with <stuff></stuff>
--}}
`
        );
    });

    test('pint: block comments inside a div', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>
        {{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}
        </div>`).trim(),
            `<div>
    {{--
        Block Comment.
        with many lines and with <stuff></stuff>
    --}}
</div>`
        );
    });
});