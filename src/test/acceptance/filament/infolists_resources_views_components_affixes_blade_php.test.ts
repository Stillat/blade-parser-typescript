import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: infolists_resources_views_components_affixes_blade_php', () => {
    test('pint: it can format infolists_resources_views_components_affixes_blade_php', () => {
        const input = `@props([
    'prefixActions' => [],
    'suffixActions' => [],
])

@php
    $prefixActions = array_filter(
        $prefixActions,
        fn (\\Filament\\Infolists\\Components\\Actions\\Action $prefixAction): bool => $prefixAction->isVisible(),
    );

    $suffixActions = array_filter(
        $suffixActions,
        fn (\\Filament\\Infolists\\Components\\Actions\\Action $suffixAction): bool => $suffixAction->isVisible(),
    );
@endphp

<div {{ $attributes->class(['filament-infolists-affix-container flex rtl:space-x-reverse group']) }}>
    @if (count($prefixActions))
        <div class="self-stretch flex gap-1 items-center pe-2">
            @foreach ($prefixActions as $prefixAction)
                {{ $prefixAction }}
            @endforeach
        </div>
    @endif

    <div class="flex-1 min-w-0">
        {{ $slot }}
    </div>

    @if (count($suffixActions))
        <div class="self-stretch flex gap-1 items-center ps-2">
            @foreach ($suffixActions as $suffixAction)
                {{ $suffixAction }}
            @endforeach
        </div>
    @endif
</div>
`;
        const output = `@props([
    'prefixActions' => [],
    'suffixActions' => [],
])

@php
    $prefixActions = array_filter(
        $prefixActions,
        fn (\\Filament\\Infolists\\Components\\Actions\\Action $prefixAction): bool => $prefixAction->isVisible(),
    );

    $suffixActions = array_filter(
        $suffixActions,
        fn (\\Filament\\Infolists\\Components\\Actions\\Action $suffixAction): bool => $suffixAction->isVisible(),
    );
@endphp

<div
    {{ $attributes->class(['filament-infolists-affix-container flex rtl:space-x-reverse group']) }}
>
    @if (count($prefixActions))
        <div class="flex items-center gap-1 self-stretch pe-2">
            @foreach ($prefixActions as $prefixAction)
                {{ $prefixAction }}
            @endforeach
        </div>
    @endif

    <div class="min-w-0 flex-1">
        {{ $slot }}
    </div>

    @if (count($suffixActions))
        <div class="flex items-center gap-1 self-stretch ps-2">
            @foreach ($suffixActions as $suffixAction)
                {{ $suffixAction }}
            @endforeach
        </div>
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});