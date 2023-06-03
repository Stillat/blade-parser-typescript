import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: admin_resources_views_components_stats_index_blade_php', () => {
    test('pint: it can format admin_resources_views_components_stats_index_blade_php', () => {
        const input = `@props([
    'columns' => '3',
])

@php
    $columns = (int) $columns;
@endphp

<div {{ $attributes->class([
    'filament-stats grid gap-4 lg:gap-8',
    'md:grid-cols-3' => $columns === 3,
    'md:grid-cols-1' => $columns === 1,
    'md:grid-cols-2' => $columns === 2,
    'md:grid-cols-2 xl:grid-cols-4' => $columns === 4,
]) }}>
    {{ $slot }}
</div>
`;
        const output = `@props([
    'columns' => '3',
])

@php
    $columns = (int) $columns;
@endphp

<div
    {{
        $attributes->class([
            'filament-stats grid gap-4 lg:gap-8',
            'md:grid-cols-3' => $columns === 3,
            'md:grid-cols-1' => $columns === 1,
            'md:grid-cols-2' => $columns === 2,
            'md:grid-cols-2 xl:grid-cols-4' => $columns === 4,
        ])
    }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});