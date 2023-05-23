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

    test('it does not indent already indented code', () => {
        const template = `@php
    /**
    * @deprecated Override \`logo.blade.php\` instead.
    */
@endphp`;
        const out = `@php
    /**
    * @deprecated Override \`logo.blade.php\` instead.
    */
@endphp
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('php block content is not lost', () => {
        const template = `@if (true)
    @if (false)
    @if ('something')
    @php
    $foo = 'foo';
@endphp
    @endif
    @endif
@endif

`;
        const out = `@if (true)
    @if (false)
        @if ("something")
            @php
                $foo = "foo";
            @endphp
        @endif
    @endif
@endif
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it reflows arrows inside php blocks', () => {
        const template = `@php
    fn () => true;
@endphp`;
        const out = `@php
    fn () => true;
@endphp
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it reflows arrows inside php blocks2', () => {
        const template = `<?php
    fn () => true;
?>`;
        const out = `<?php
fn () => true;
?>
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it is smart about print width', () => {
        const input = `
@php
    $buttonClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-tabs-item flex items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset',
        'hover:text-gray-800 focus:text-primary-600' => ! $active,
        'dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-primary-400' => (! $active) && config('filament.dark_mode'),
        'text-primary-600 shadow bg-white' => $active,
    ]);
@endphp
`;
        const out = `@php
    $buttonClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        "filament-tabs-item flex items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset",
        "hover:text-gray-800 focus:text-primary-600" => ! $active,
        "dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-primary-400" => ! $active && config("filament.dark_mode"),
        "text-primary-600 shadow bg-white" => $active,
    ]);
@endphp
`;

        assert.strictEqual(formatBladeString(input), out);
        assert.strictEqual(formatBladeString(out), out);
    });
});