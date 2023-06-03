import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_reorder_indicator_blade_php', () => {
    test('pint: it can format tables_resources_views_components_reorder_indicator_blade_php', () => {
        const input = `@props([
    'colspan',
])

<div
    x-cloak
    {{
        $attributes
            ->merge([
                'wire:key' => "{$this->id}.table.reorder.indicator",
            ], escape: false)
            ->class(['filament-tables-reorder-indicator bg-primary-500/10 px-4 py-2 whitespace-nowrap text-sm'])
    }}
>
    <x-filament::loading-indicator
        wire:loading.delay=""
        wire:target="reorderTable"
        class="w-4 h-4 me-3 text-primary-500"
    />

    <span>
        {{ __('filament-tables::table.reorder_indicator') }}
    </span>
</div>
`;
        const output = `@props([
    'colspan',
])

<div
    x-cloak
    {{
        $attributes
            ->merge([
                'wire:key' => "{$this->id}.table.reorder.indicator",
            ], escape: false)
            ->class(['filament-tables-reorder-indicator bg-primary-500/10 whitespace-nowrap px-4 py-2 text-sm'])
    }}
>
    <x-filament::loading-indicator
        wire:loading.delay=""
        wire:target="reorderTable"
        class="text-primary-500 me-3 h-4 w-4"
    />

    <span>
        {{ __('filament-tables::table.reorder_indicator') }}
    </span>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});