import assert from 'assert';
import { formatBladeString, formatBladeStringWithPint } from '../formatting/prettier/utils.js';
import { defaultSettings } from '../formatting/optionDiscovery.js';

suite('@php @endphp Formatting', () => {
    test('it indents php blocks', async () => {
        assert.strictEqual(
            (await formatBladeString(`<main class="index">
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
</main>`)).trim(),
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

    test('it does not indent empty lines', async () => {
        const input =  `@php
    $foo = 'foo';

    $bar = 'bar';
@endphp`;

        const out = `@php
    $foo = "foo";

    $bar = "bar";
@endphp
`;

        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it does not indent already indented code', async () => {
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
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('php block content is not lost', async () => {
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
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it reflows arrows inside php blocks', async () => {
        const template = `@php
    fn () => true;
@endphp`;
        const out = `@php
    fn () => true;
@endphp
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it reflows arrows inside php blocks2', async () => {
        const template = `<?php
    fn () => true;
?>`;
        const out = `<?php
fn () => true;
?>
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it is smart about print width', async () => {
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

        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it preserves php blocks when format directive php parameters is disabled', async () => {
        const input =  `
        @php $size = match ($size) { 'xs' => 'h-5 w-5 md:h-4 md:w-4', 'sm' => 'h-6 w-6 md:h-5 md:w-5', 'md' => 'h-7 w-7 md:h-6 md:w-6', 'lg' => 'h-8 w-8 md:h-7 md:w-7', 'xl' => 'h-9 w-9 md:h-8 md:w-8', default => $size, }; @endphp
        
        `;
        const out = `@php
 $size = match ($size) { 'xs' => 'h-5 w-5 md:h-4 md:w-4', 'sm' => 'h-6 w-6 md:h-5 md:w-5', 'md' => 'h-7 w-7 md:h-6 md:w-6', 'lg' => 'h-8 w-8 md:h-7 md:w-7', 'xl' => 'h-9 w-9 md:h-8 md:w-8', default => $size, }; 
@endphp
`;
        assert.strictEqual(await formatBladeString(input, {
            ...defaultSettings,
            formatDirectivePhpParameters: false,
        }), out);
    });

    test('formatting unclosed php inside attributes aborts formatting', async () => {
        const input = `
<button x-data="<?php $someoneWillDoThis ?> <?= $moreStuff ?"></button>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), input);
    });
});