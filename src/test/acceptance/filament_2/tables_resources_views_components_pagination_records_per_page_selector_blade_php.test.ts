import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_pagination_records_per_page_selector_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_pagination_records_per_page_selector_blade_php', async () => {
        const input = `@props([
    'options',
])

<div class="flex items-center space-x-2 filament-tables-pagination-records-per-page-selector rtl:space-x-reverse">
    <label>
        <select wire:model="tableRecordsPerPage" @class([
            'h-8 text-sm pr-8 leading-none transition duration-75 border-gray-300 rounded-lg shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500',
            'dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-primary-500' => config('tables.dark_mode'),
        ])>
            @foreach ($options as $option)
                <option value="{{ $option }}">{{ $option === -1 ? __('tables::table.pagination.fields.records_per_page.options.all') : $option }}</option>
            @endforeach
        </select>

        <span @class([
            'text-sm font-medium',
            'dark:text-white' => config('tables.dark_mode'),
        ])>
            {{ __('tables::table.pagination.fields.records_per_page.label') }}
        </span>
    </label>
</div>
`;
        const output = `@props([
    'options',
])

<div
    class="filament-tables-pagination-records-per-page-selector flex items-center space-x-2 rtl:space-x-reverse"
>
    <label>
        <select
            wire:model="tableRecordsPerPage"
            @class([
                'focus:border-primary-500 focus:ring-primary-500 h-8 rounded-lg border-gray-300 pr-8 text-sm leading-none shadow-sm outline-none transition duration-75 focus:ring-1 focus:ring-inset',
                'dark:focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white' => config('tables.dark_mode'),
            ])
        >
            @foreach ($options as $option)
                <option value="{{ $option }}">
                    {{ $option === -1 ? __('tables::table.pagination.fields.records_per_page.options.all') : $option }}
                </option>
            @endforeach
        </select>

        <span
            @class([
                'text-sm font-medium',
                'dark:text-white' => config('tables.dark_mode'),
            ])
        >
            {{ __('tables::table.pagination.fields.records_per_page.label') }}
        </span>
    </label>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});