import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_search_input_blade_php', () => {
    test('pint: it can format tables_resources_views_components_search_input_blade_php', () => {
        const input = `@props([
    'wireModel' => 'tableSearch',
])

<div {{ $attributes->class(['filament-tables-search-input']) }}>
    <label class="relative flex items-center group">
        <span class="filament-tables-search-input-icon-wrapper absolute inset-y-0 start-0 flex items-center justify-center w-9 h-9 pointer-events-none">
            <x-filament::icon
                name="heroicon-m-magnifying-glass"
                alias="filament-tables::search-input.prefix"
                color="text-gray-400"
                size="h-5 w-5"
            />
        </span>

        <input
            wire:model.debounce.500ms="{{ $wireModel }}"
            placeholder="{{ __('filament-tables::table.fields.search.placeholder') }}"
            type="text"
            autocomplete="off"
            class="block w-full max-w-xs min-w-[8rem] h-9 ps-9 placeholder-gray-400 transition duration-75 border-gray-300 rounded-lg shadow-sm outline-none sm:text-sm focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />

        <span class="sr-only">
            {{ __('filament-tables::table.fields.search.label') }}
        </span>
    </label>
</div>
`;
        const output = `@props([
    'wireModel' => 'tableSearch',
])

<div {{ $attributes->class(['filament-tables-search-input']) }}>
    <label class="group relative flex items-center">
        <span
            class="filament-tables-search-input-icon-wrapper pointer-events-none absolute inset-y-0 start-0 flex h-9 w-9 items-center justify-center"
        >
            <x-filament::icon
                name="heroicon-m-magnifying-glass"
                alias="filament-tables::search-input.prefix"
                color="text-gray-400"
                size="h-5 w-5"
            />
        </span>

        <input
            wire:model.debounce.500ms="{{ $wireModel }}"
            placeholder="{{ __('filament-tables::table.fields.search.placeholder') }}"
            type="text"
            autocomplete="off"
            class="focus:border-primary-500 focus:ring-primary-500 block h-9 w-full min-w-[8rem] max-w-xs rounded-lg border-gray-300 ps-9 placeholder-gray-400 shadow-sm outline-none transition duration-75 focus:ring-1 focus:ring-inset dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />

        <span class="sr-only">
            {{ __('filament-tables::table.fields.search.label') }}
        </span>
    </label>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});