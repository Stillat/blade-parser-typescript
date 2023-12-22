import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_filters_indicators_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_filters_indicators_blade_php', async () => {
        const input = `@props([
    'indicators' => [],
])

@if (count($indicators))
    <div {{ $attributes->class(['filament-tables-filter-indicators bg-gray-500/5 gap-x-4 px-4 py-1 text-sm flex']) }}>
        <div class="flex flex-1 items-center flex-wrap gap-y-1 gap-x-2">
            <span class="font-medium dark:text-gray-200">
                {{ __('tables::table.filters.indicator') }}
            </span>

            @foreach ($indicators as $filter => $filterIndicators)
                @foreach ($filterIndicators as $field => $indicator)
                    @php
                        $field = is_numeric($field) ? null : $field;
                    @endphp

                    <span @class([
                        'filament-tables-filter-indicator inline-flex items-center justify-center min-h-6 px-2 py-0.5 text-xs font-medium tracking-tight rounded-xl text-gray-700 bg-gray-500/10 whitespace-normal',
                        'dark:text-gray-300 dark:bg-gray-500/20' => config('tables.dark_mode'),
                    ])>
                        {{ $indicator }}

                        <button
                            wire:click="removeTableFilter('{{ $filter }}'{{ $field ? ' , \\'' . $field . '\\'' : null }})"
                            wire:loading.attr="disabled"
                            wire:loading.class="cursor-wait"
                            wire:target="removeTableFilter"
                            type="button"
                            class="ml-1 -mr-2 rtl:mr-1 rtl:-ml-2 p-1 -my-1 hover:bg-gray-500/10 rounded-full"
                        >
                            <x-heroicon-s-x class="w-3 h-3" />

                            <span class="sr-only">
                                {{ __('tables::table.filters.buttons.remove.label') }}
                            </span>
                        </button>
                    </span>
                @endforeach
            @endforeach
        </div>

        <div class="flex-shrink-0">
            <button
                wire:click="removeTableFilters"
                type="button"
                @class([
                    '-mb-1.5 -mt-0.5 -mr-2 p-1.5 text-gray-600 hover:bg-gray-500/10 rounded-full hover:text-gray-700',
                    'dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-500/20' => config('tables.dark_mode'),
                ])
            >
                <div class="w-5 h-5 flex items-center justify-center">
                    <x-heroicon-s-x
                        :x-tooltip.raw="__('tables::table.filters.buttons.remove_all.tooltip')"
                        wire:loading.remove.delay
                        wire:target="removeTableFilters,removeTableFilter"
                        class="w-5 h-5"
                    />

                    <x-filament-support::loading-indicator
                        wire:loading.delay
                        wire:target="removeTableFilters,removeTableFilter"
                        class="w-5 h-5"
                    />
                </div>

                <span class="sr-only">
                    {{ __('tables::table.filters.buttons.remove_all.label') }}
                </span>
            </button>
        </div>
    </div>
@endif
`;
        const output = `@props([
    'indicators' => [],
])

@if (count($indicators))
    <div
        {{ $attributes->class(['filament-tables-filter-indicators flex gap-x-4 bg-gray-500/5 px-4 py-1 text-sm']) }}
    >
        <div class="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1">
            <span class="font-medium dark:text-gray-200">
                {{ __('tables::table.filters.indicator') }}
            </span>

            @foreach ($indicators as $filter => $filterIndicators)
                @foreach ($filterIndicators as $field => $indicator)
                    @php
                        $field = is_numeric($field) ? null : $field;
                    @endphp

                    <span
                        @class([
                            'filament-tables-filter-indicator min-h-6 inline-flex items-center justify-center whitespace-normal rounded-xl bg-gray-500/10 px-2 py-0.5 text-xs font-medium tracking-tight text-gray-700',
                            'dark:bg-gray-500/20 dark:text-gray-300' => config('tables.dark_mode'),
                        ])
                    >
                        {{ $indicator }}

                        <button
                            wire:click="removeTableFilter('{{ $filter }}'{{ $field ? ' , \\''.$field.'\\'' : null }})"
                            wire:loading.attr="disabled"
                            wire:loading.class="cursor-wait"
                            wire:target="removeTableFilter"
                            type="button"
                            class="-my-1 -mr-2 ml-1 rounded-full p-1 hover:bg-gray-500/10 rtl:-ml-2 rtl:mr-1"
                        >
                            <x-heroicon-s-x class="h-3 w-3" />

                            <span class="sr-only">
                                {{ __('tables::table.filters.buttons.remove.label') }}
                            </span>
                        </button>
                    </span>
                @endforeach
            @endforeach
        </div>

        <div class="flex-shrink-0">
            <button
                wire:click="removeTableFilters"
                type="button"
                @class([
                    '-mb-1.5 -mr-2 -mt-0.5 rounded-full p-1.5 text-gray-600 hover:bg-gray-500/10 hover:text-gray-700',
                    'dark:text-gray-400 dark:hover:bg-gray-500/20 dark:hover:text-gray-300' => config('tables.dark_mode'),
                ])
            >
                <div class="flex h-5 w-5 items-center justify-center">
                    <x-heroicon-s-x
                        :x-tooltip.raw="__('tables::table.filters.buttons.remove_all.tooltip')"
                        wire:loading.remove.delay
                        wire:target="removeTableFilters,removeTableFilter"
                        class="h-5 w-5"
                    />

                    <x-filament-support::loading-indicator
                        wire:loading.delay
                        wire:target="removeTableFilters,removeTableFilter"
                        class="h-5 w-5"
                    />
                </div>

                <span class="sr-only">
                    {{ __('tables::table.filters.buttons.remove_all.label') }}
                </span>
            </button>
        </div>
    </div>
@endif
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});