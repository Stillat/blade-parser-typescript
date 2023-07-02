import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Basic Node Formatting', () => {
    test('it formats echos', () => {
        assert.strictEqual(
            formatBladeString('{{ $title }}').trim(),
            "{{ $title }}"
        );
    });

    test('it formats echo variant', () => {
        assert.strictEqual(
            formatBladeString('{{{ $title }}}').trim(),
            "{{{ $title }}}"
        );
    });

    test('it formats escaped echos', () => {
        assert.strictEqual(
            formatBladeString('{!! $title !!}').trim(),
            "{!! $title !!}"
        );
    });

    test('it formats simple comments', () => {
        assert.strictEqual(
            formatBladeString('{{-- Comment. --}}').trim(),
            "{{-- Comment. --}}"
        );
    });

    test('it formats block comments', () => {
        assert.strictEqual(
            formatBladeString(`{{--
                Block Comment. --}}`).trim(),
            `{{--
    Block Comment.
--}}`
        );
    });

    test('it formats block comments with', () => {
        assert.strictEqual(
            formatBladeString(`{{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}`),
            `{{--
    Block Comment.
    with many lines and with <stuff></stuff>
--}}
`
        );
    });

    test('block comments inside a div', () => {
        assert.strictEqual(
            formatBladeString(`<div>
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

    test('ignored fragmented elements are actually ignored', () => {
        const input = `
@if ($someCondition)
    {{-- format-ignore-start --}}<x-slot:the_slot>{{-- format-ignore-end --}}
@endif

    <!-- More content here. -->

@if ($someCondition)
    {{-- format-ignore-start --}}</x-slot>{{-- format-ignore-end --}}
@endif
`;
        const out = `@if ($someCondition)
    {{-- format-ignore-start --}}<x-slot:the_slot>{{-- format-ignore-end --}}
@endif

<!-- More content here. -->

@if ($someCondition)
    {{-- format-ignore-start --}}</x-slot>{{-- format-ignore-end --}}
@endif
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('comments can be formatted inside html elements', () => {
        const input = `

<div
    {{-- A comment! --}}
>
<p>Hello, world!</p>
</div>
`;
        const out = `<div {{-- A comment! --}}>
    <p>Hello, world!</p>
</div>
`;
        assert.strictEqual(formatBladeString(input), out);
    });
});