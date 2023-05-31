import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_filters_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_filters_index_blade_php', () => {
        const input = `@props([
    'form',
])

<div {{ $attributes->class(['filament-tables-filters-form space-y-6']) }}>
    {{ $form }}

    <div class="flex items-center justify-between gap-3">
        <div>
            <x-filament::loading-indicator
                wire:target="$set,tableFilters,resetTableFiltersForm"
                wire:loading.delay=""
                class="h-4 w-4 text-gray-700"
            />
        </div>

        <x-filament::link
            wire:click="resetTableFiltersForm"
            color="danger"
            tag="button"
            size="sm"
        >
            {{ __('filament-tables::table.filters.buttons.reset.label') }}
        </x-filament::link>
    </div>
</div>
`;
        const output = `@props([
    'form',
])

<div {{ $attributes->class(['filament-tables-filters-form space-y-6']) }}>
    {{ $form }}

    <div class="flex items-center justify-between gap-3">
        <div>
            <x-filament::loading-indicator
                wire:target="$set,tableFilters,resetTableFiltersForm"
                wire:loading.delay=""
                class="h-4 w-4 text-gray-700"
            />
        </div>

        <x-filament::link
            wire:click="resetTableFiltersForm"
            color="danger"
            tag="button"
            size="sm"
        >
            {{ __('filament-tables::table.filters.buttons.reset.label') }}
        </x-filament::link>
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});