import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_selection_indicator_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_selection_indicator_blade_php', async () => {
        const input = `@props([
    'allSelectableRecordsCount',
    'colspan',
    'selectedRecordsCount',
])

<div
    x-cloak
    {{
        $attributes
            ->merge([
                'wire:key' => "{$this->id}.table.selection.indicator",
            ], escape: false)
            ->class(['filament-tables-selection-indicator bg-primary-500/10 px-4 py-2 whitespace-nowrap text-sm'])
    }}
>
    <x-filament::loading-indicator
        x-show="isLoading"
        class="inline-block w-4 h-4 me-3 text-primary-500"
    />

    <span
        class="dark:text-white"
        x-text="window.pluralize(@js(__('filament-tables::table.selection_indicator.selected_count')), selectedRecords.length, { count: selectedRecords.length })"
    ></span>

    <span id="{{ $this->id }}.table.selection.indicator.record-count.{{ $allSelectableRecordsCount }}" x-show="{{ $allSelectableRecordsCount }} !== selectedRecords.length">
        <button x-on:click="selectAllRecords" class="text-sm font-medium text-primary-600">
            {{ trans_choice('filament-tables::table.selection_indicator.buttons.select_all.label', $allSelectableRecordsCount) }}.
        </button>
    </span>

    <span>
        <button x-on:click="deselectAllRecords" class="text-sm font-medium text-primary-600">
            {{ __('filament-tables::table.selection_indicator.buttons.deselect_all.label') }}.
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
    x-cloak
    {{
        $attributes
            ->merge([
                'wire:key' => "{$this->id}.table.selection.indicator",
            ], escape: false)
            ->class(['filament-tables-selection-indicator bg-primary-500/10 whitespace-nowrap px-4 py-2 text-sm'])
    }}
>
    <x-filament::loading-indicator
        x-show="isLoading"
        class="text-primary-500 me-3 inline-block h-4 w-4"
    />

    <span
        class="dark:text-white"
        x-text="
            window.pluralize(@js(__('filament-tables::table.selection_indicator.selected_count')), selectedRecords.length, {
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
            {{ trans_choice('filament-tables::table.selection_indicator.buttons.select_all.label', $allSelectableRecordsCount) }}.
        </button>
    </span>

    <span>
        <button
            x-on:click="deselectAllRecords"
            class="text-primary-600 text-sm font-medium"
        >
            {{ __('filament-tables::table.selection_indicator.buttons.deselect_all.label') }}.
        </button>
    </span>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});