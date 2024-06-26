import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_header_cell_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_header_cell_blade_php', async () => {
        const input = `@props([
    'activelySorted' => false,
    'name',
    'sortable' => false,
    'sortDirection',
    'alignment' => null,
    'wrap' => false,
])

<th {{ $attributes->class(['filament-tables-header-cell p-0']) }}>
    <button
        @if ($sortable)
            wire:click="sortTable('{{ $name }}')"
        @endif
        type="button"
        @class([
            'flex items-center gap-x-1 w-full px-4 py-2 font-medium text-sm text-gray-600 dark:text-gray-300',
            'cursor-default' => ! $sortable,
            'whitespace-nowrap' => ! $wrap,
            'whitespace-normal' => $wrap,
            match ($alignment) {
                'center' => 'justify-center',
                'end' => 'justify-end',
                'left' => 'justify-start rtl:flex-row-reverse',
                'right' => 'justify-end rtl:flex-row-reverse',
                'start' => 'justify-start',
                default => null,
            },
        ])
    >
        @if ($sortable)
            <span class="sr-only">
                {{ __('filament-tables::table.sorting.fields.column.label') }}
            </span>
        @endif

        <span>
            {{ $slot }}
        </span>

        @if ($sortable)
            <x-filament::icon
                :name="$activelySorted && $sortDirection === 'asc' ? 'heroicon-m-chevron-up' : 'heroicon-m-chevron-down'"
                :alias="$activelySorted && $sortDirection === 'asc' ? 'filament-tables::header-cell.sort-asc' : 'filament-tables::header-cell.sort-desc'"
                color="dark:text-gray-300"
                size="h-5 w-5"
                :class="[
                    'filament-tables-header-cell-sort-icon',
                    'opacity-25' => ! $activelySorted,
                ]"
            />

            <span class="sr-only">
                {{ $sortDirection === 'asc' ? __('filament-tables::table.sorting.fields.direction.options.desc') : __('filament-tables::table.sorting.fields.direction.options.asc') }}
            </span>
        @endif
    </button>
</th>
`;
        const output = `@props([
    'activelySorted' => false,
    'name',
    'sortable' => false,
    'sortDirection',
    'alignment' => null,
    'wrap' => false,
])

<th {{ $attributes->class(['filament-tables-header-cell p-0']) }}>
    <button
        @if ($sortable)
            wire:click="sortTable('{{ $name }}')"
        @endif
        type="button"
        @class([
            'flex w-full items-center gap-x-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300',
            'cursor-default' => ! $sortable,
            'whitespace-nowrap' => ! $wrap,
            'whitespace-normal' => $wrap,
            match ($alignment) {
                'center' => 'justify-center',
                'end' => 'justify-end',
                'left' => 'justify-start rtl:flex-row-reverse',
                'right' => 'justify-end rtl:flex-row-reverse',
                'start' => 'justify-start',
                default => null,
            },
        ])
    >
        @if ($sortable)
            <span class="sr-only">
                {{ __('filament-tables::table.sorting.fields.column.label') }}
            </span>
        @endif

        <span>
            {{ $slot }}
        </span>

        @if ($sortable)
            <x-filament::icon
                :name="$activelySorted && $sortDirection === 'asc' ? 'heroicon-m-chevron-up' : 'heroicon-m-chevron-down'"
                :alias="$activelySorted && $sortDirection === 'asc' ? 'filament-tables::header-cell.sort-asc' : 'filament-tables::header-cell.sort-desc'"
                color="dark:text-gray-300"
                size="h-5 w-5"
                :class="
                    [
                        'filament-tables-header-cell-sort-icon',
                        'opacity-25' => ! $activelySorted,
                    ]
                "
            />

            <span class="sr-only">
                {{ $sortDirection === 'asc' ? __('filament-tables::table.sorting.fields.direction.options.desc') : __('filament-tables::table.sorting.fields.direction.options.asc') }}
            </span>
        @endif
    </button>
</th>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});