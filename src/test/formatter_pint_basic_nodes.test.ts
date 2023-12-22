import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Basic Nodes', () => {
    test('pint: it formats echos', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{{ $title }}')).trim(),
            "{{ $title }}"
        );
    });

    test('pint: it formats echo variant', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{{{ $title }}}')).trim(),
            "{{{ $title }}}"
        );
    });

    test('pint: it formats escaped echos', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{!! $title !!}')).trim(),
            "{!! $title !!}"
        );
    });

    test('pint: it formats simple comments', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{{-- Comment. --}}')).trim(),
            "{{-- Comment. --}}"
        );
    });

    test('pint: it formats block comments', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`{{--
                Block Comment. --}}`)).trim(),
            `{{--
    Block Comment.
--}}`
        );
    });

    test('pint: it formats block comments with', async () => {
        assert.strictEqual(
            await formatBladeStringWithPint(`{{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}`),
            `{{--
    Block Comment.
    with many lines and with <stuff></stuff>
--}}
`
        );
    });

    test('pint: block comments inside a div', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div>
        {{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}
        </div>`)).trim(),
            `<div>
    {{--
        Block Comment.
        with many lines and with <stuff></stuff>
    --}}
</div>`
        );
    });
});