import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('@php @endphp Formatting', () => {
    test('it indents php blocks', () => {
        assert.strictEqual(
            formatBladeString(`<main class="index">
<div>
        {{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}
        </div>

<div>
    @php
$data = [
[
'href' => '#',
'title' => 'The Title',
],
];
    @endphp
</div>
    @php
$data = [
[
'href' => '#',
'title' => 'The Title',
],
];
    @endphp
</main>`).trim(),
            `<main class="index">
    <div>
        {{--
            Block Comment.
            with many lines and with <stuff></stuff>
        --}}
    </div>

    <div>
        @php
            $data = [
                [
                    "href" => "#",
                    "title" => "The Title",
                ],
            ];
        @endphp
    </div>
    @php
        $data = [
            [
                "href" => "#",
                "title" => "The Title",
            ],
        ];
    @endphp
</main>`
        );
    });

    test('it does not indent empty lines', () => {
        const input =  `@php
    $foo = 'foo';

    $bar = 'bar';
@endphp`;

        const out = `@php
    $foo = "foo";

    $bar = "bar";
@endphp
`;

        assert.strictEqual(formatBladeString(input), out);
    });
});