import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_stats_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_stats_index_blade_php', async () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});