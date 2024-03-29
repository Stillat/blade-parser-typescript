import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';
import { setupTestHooks } from './testUtils/formatting.js';

suite('Pint Transformer: PHP Blocks', () => {
    setupTestHooks();

    test('pint: it preserves relative indents within PHP', async () => {
        const input = `@php
$wireClickAction =
    $action->getAction() && ! $action->getUrl()
        ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
        : null;
@endphp

<?php
$wireClickAction =
    $action->getAction() && ! $action->getUrl()
        ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
        : null;
?>
`;
        const expected = `@php
    $wireClickAction =
        $action->getAction() && ! $action->getUrl()
            ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
            : null;
@endphp

<?php
$wireClickAction =
    $action->getAction() && ! $action->getUrl()
        ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
        : null;
?>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), expected);
    });

    test('pint: it indents php blocks', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<main class="index">
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
</main>`
        );
    });

    test('pint: it does not indent empty lines', async () => {
        const input =  `@php
    $foo = 'foo';

    $bar = 'bar';
@endphp`;

        const out = `@php
    $foo = 'foo';

    $bar = 'bar';
@endphp
`;

        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('pint: it does not indent already indented code', async () => {
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
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: php block content is not lost', async () => {
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
        @if ('something')
            @php
                $foo = 'foo';
            @endphp
        @endif
    @endif
@endif
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it reflows arrows inside php blocks', async () => {
        const template = `@php
    fn () => true;
@endphp`;
        const out = `@php
    fn () => true;
@endphp
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it reflows arrows inside php blocks2', async () => {
        const template = `<?php
    fn () => true;
?>`;
        const out = `<?php
fn () => true;
?>
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it is smart about print width', async () => {
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
        'filament-tabs-item flex items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset',
        'hover:text-gray-800 focus:text-primary-600' => ! $active,
        'dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-primary-400' => (! $active) && config('filament.dark_mode'),
        'text-primary-600 shadow bg-white' => $active,
    ]);
@endphp
`;

        assert.strictEqual(await formatBladeStringWithPint(input), out);
        assert.strictEqual(await formatBladeStringWithPint(out), out);
    });

    test('it can do reasonable things with deeply indented code', async () => {
        // This requiresmoving the `match` part to the line with the assignment.
        // Otherwise things get confused when transitioning between Pint/Prettier.
        const input = `
<div>
    <div>
         <div>
            <div
                x-cloak
                x-ref="panel"
                x-float.placement.bottom-start.offset.flip.shift="{ offset: 8 }"
                wire:ignore.self
                wire:key="{{ $this->id }}.{{ $getStatePath() }}.{{ $field::class }}.panel"
                @class([
                    'hidden absolute z-10 shadow-lg',
                    'opacity-70 pointer-events-none' => $isDisabled(),
                ])
            >
                @php
                    $tag = match ($getFormat()) {
                            'hsl' => 'hsl-string',
                            'rgb' => 'rgb-string',
                            'rgba' => 'rgba-string',
                            default => 'hex',
                        } . '-color-picker';
                @endphp

                <{{ $tag }} color="{{ $getState() }}" />
            </div>
        </div>
    </div>
</div>
`;
        const out = `<div>
    <div>
        <div>
            <div
                x-cloak
                x-ref="panel"
                x-float.placement.bottom-start.offset.flip.shift="{ offset: 8 }"
                wire:ignore.self
                wire:key="{{ $this->id }}.{{ $getStatePath() }}.{{ $field::class }}.panel"
                @class([
                    'absolute z-10 hidden shadow-lg',
                    'pointer-events-none opacity-70' => $isDisabled(),
                ])
            >
                @php
                    $tag = match ($getFormat()) {
                        'hsl' => 'hsl-string',
                        'rgb' => 'rgb-string',
                        'rgba' => 'rgba-string',
                        default => 'hex',
                    }.'-color-picker';
                @endphp

                <{{ $tag }} color="{{ $getState() }}" />
            </div>
        </div>
    </div>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('pint: placeholder characters are not in output #1', async () => {
        const template = `<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">

        <meta name="application-name" content="{{ config('app.name') }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

        <style>[x-cloak] { display: none !important; }</style>
        @livewireStyles
        @filamentStyles
        @vite('resources/css/app.css')
    </head>

    <body class="antialiased">
        {{ $slot }}

        @php

            $one = '';
            $two = '';
        @endphp

        @livewireScripts
        @filamentScripts(['something/here', 'another', 'some more', $howAboutThis])
        @vite('resources/js/app.js')
        <script src="//unpkg.com/alpinejs" defer></script>
    </body>
</html>
`;
        const output = `<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />

        <meta name="application-name" content="{{ config('app.name') }}" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>{{ config('app.name') }}</title>

        <style>
            [x-cloak] {
                display: none !important;
            }
        </style>
        @livewireStyles
        @filamentStyles
        @vite('resources/css/app.css')
    </head>

    <body class="antialiased">
        {{ $slot }}

        @php
            $one = '';
            $two = '';
        @endphp

        @livewireScripts
        @filamentScripts(['something/here', 'another', 'some more', $howAboutThis])
        @vite('resources/js/app.js')
        <script src="//unpkg.com/alpinejs" defer></script>
    </body>
</html>
`;
        assert.strictEqual(await formatBladeStringWithPint(template), output);
    });

    test('pint: it doesnt needlessly indent', async () => {
        const input = `@props([
    'action',
    'component',
])

@php
    $wireClickAction =
        $action->getAction() && ! $action->getUrl()
            ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
            : null;
@endphp

<x-dynamic-component
    :component="$component"
    :dark-mode="config('forms.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$wireClickAction"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :tooltip="$action->getTooltip()"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :disabled="$action->isDisabled()"
    :color="$action->getColor()"
    :label="$action->getLabel()"
    :icon="$action->getIcon()"
    :size="$action->getSize()"
    dusk="filament.forms.action.{{ $action->getName() }}"
>
    {{ $slot }}
</x-dynamic-component>
`;
        const output = `@props([
    'action',
    'component',
])

@php
    $wireClickAction =
        $action->getAction() && ! $action->getUrl()
            ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
            : null;
@endphp

<x-dynamic-component
    :component="$component"
    :dark-mode="config('forms.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$wireClickAction"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :tooltip="$action->getTooltip()"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :disabled="$action->isDisabled()"
    :color="$action->getColor()"
    :label="$action->getLabel()"
    :icon="$action->getIcon()"
    :size="$action->getSize()"
    dusk="filament.forms.action.{{ $action->getName() }}"
>
    {{ $slot }}
</x-dynamic-component>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), output);
    });

    test('pint: it can be smart about relative indent', async () => {
        const input = `@props([
    'action',
    'component',
])
@php
    $wireClickAction =
        $action->getAction() && ! $action->getUrl()
            ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
            : null;
@endphp

@php
    $wireClickAction = ($action->getAction() && (! $action->getUrl())) ?
        "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')" :
        null;
@endphp

<div>
@php
    $wireClickAction = ($action->getAction() && (! $action->getUrl())) ?
        "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')" :
        null;
@endphp
</div>

<div><div>

<div>
@php
    $wireClickAction = ($action->getAction() && (! $action->getUrl())) ?
        "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')" :
        null;
@endphp
</div>
</div></div>

<div><div><div>
@php
    $wireClickAction =
        $action->getAction() && ! $action->getUrl()
            ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
            : null;
@endphp
</div></div></div>
`;
        const out = `@props([
    'action',
    'component',
])
@php
    $wireClickAction =
        $action->getAction() && ! $action->getUrl()
            ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
            : null;
@endphp

@php
    $wireClickAction = ($action->getAction() && (! $action->getUrl())) ?
        "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')" :
        null;
@endphp

<div>
    @php
        $wireClickAction = ($action->getAction() && (! $action->getUrl())) ?
            "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')" :
            null;
    @endphp
</div>

<div>
    <div>
        <div>
            @php
                $wireClickAction = ($action->getAction() && (! $action->getUrl())) ?
                    "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')" :
                    null;
            @endphp
        </div>
    </div>
</div>

<div>
    <div>
        <div>
            @php
                $wireClickAction =
                    $action->getAction() && ! $action->getUrl()
                        ? "mountFormComponentAction('{$action->getComponent()->getStatePath()}', '{$action->getName()}')"
                        : null;
            @endphp
        </div>
    </div>
</div>
`
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('pint: it automatically removes strict types', async () => {
        const input =  `

@if (! $something)

@endif

@php
    $size = match ($size) {
        'xs' => 'h-5 w-5 md:h-4 md:w-4',
        'sm' => 'h-6 w-6 md:h-5 md:w-5',
        'md' => 'h-7 w-7 md:h-6 md:w-6',
        'lg' => 'h-8 w-8 md:h-7 md:w-7',
        'xl' => 'h-9 w-9 md:h-8 md:w-8',
        default => $size,
    };
@endphp
`;
        const expected = `@if (! $something)
@endif

@php
    $size = match ($size) {
        'xs' => 'h-5 w-5 md:h-4 md:w-4',
        'sm' => 'h-6 w-6 md:h-5 md:w-5',
        'md' => 'h-7 w-7 md:h-6 md:w-6',
        'lg' => 'h-8 w-8 md:h-7 md:w-7',
        'xl' => 'h-9 w-9 md:h-8 md:w-8',
        default => $size,
    };
@endphp
`;
        assert.strictEqual(await formatBladeStringWithPint(input), expected);
    });
});