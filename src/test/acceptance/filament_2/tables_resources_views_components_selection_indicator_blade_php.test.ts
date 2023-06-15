import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_selection_indicator_blade_php', () => {
    test('pint: it can format tables_resources_views_components_selection_indicator_blade_php', () => {
        const input = `@props([
    'allSelectableRecordsCount',
    'colspan',
    'selectedRecordsCount',
])

<div
    wire:key="{{ $this->id }}.table.selection.indicator"
    x-cloak
    {{ $attributes->class(['filament-tables-selection-indicator bg-primary-500/10 px-4 py-2 whitespace-nowrap text-sm']) }}
>
    <x-filament-support::loading-indicator
        x-show="isLoading"
        class="inline-block w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3 text-primary-500"
    />

    <span @class(['dark:text-white' => config('tables.dark_mode')]) x-text="window.pluralize(@js(__('tables::table.selection_indicator.selected_count')), selectedRecords.length, { count: selectedRecords.length })"></span>

    <span id="{{ $this->id }}.table.selection.indicator.record-count.{{ $allSelectableRecordsCount }}" x-show="{{ $allSelectableRecordsCount }} !== selectedRecords.length">
        <button x-on:click="selectAllRecords" class="text-sm font-medium text-primary-600">
            {{ trans_choice('tables::table.selection_indicator.buttons.select_all.label', $allSelectableRecordsCount) }}.
        </button>
    </span>

    <span>
        <button x-on:click="deselectAllRecords" class="text-sm font-medium text-primary-600">
            {{ __('tables::table.selection_indicator.buttons.deselect_all.label') }}.
        </button>
    </span>
</div>
`;
        const output = `@props([
    'allSelectableRecordsCount',
    'colspan',
    'selectedRecordsCount',
])

<div
    wire:key="{{ $this->id }}.table.selection.indicator"
    x-cloak
    {{ $attributes->class(['filament-tables-selection-indicator bg-primary-500/10 whitespace-nowrap px-4 py-2 text-sm']) }}
>
    <x-filament-support::loading-indicator
        x-show="isLoading"
        class="text-primary-500 mr-3 inline-block h-4 w-4 rtl:ml-3 rtl:mr-0"
    />

    <span
        @class(['dark:text-white' => config('tables.dark_mode')])
        x-text="
            window.pluralize(@js(__('tables::table.selection_indicator.selected_count')), selectedRecords.length, {
                count: selectedRecords.length,
            })
        "
    ></span>

    <span
        id="{{ $this->id }}.table.selection.indicator.record-count.{{ $allSelectableRecordsCount }}"
        x-show="{{ $allSelectableRecordsCount }} !== selectedRecords.length"
    >
        <button
            x-on:click="selectAllRecords"
            class="text-primary-600 text-sm font-medium"
        >
            {{ trans_choice('tables::table.selection_indicator.buttons.select_all.label', $allSelectableRecordsCount) }}.
        </button>
    </span>

    <span>
        <button
            x-on:click="deselectAllRecords"
            class="text-primary-600 text-sm font-medium"
        >
            {{ __('tables::table.selection_indicator.buttons.deselect_all.label') }}.
        </button>
    </span>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});