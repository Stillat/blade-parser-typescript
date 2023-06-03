import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_empty_state_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_empty_state_index_blade_php', () => {
        const input = `@props([
    'actions' => null,
    'columnSearches' => false,
    'description' => null,
    'heading',
    'icon',
])

<div {{ $attributes->class([
    'filament-tables-empty-state flex flex-1 flex-col items-center justify-center p-6 mx-auto space-y-6 text-center bg-white',
    'dark:bg-gray-800' => config('tables.dark_mode'),
]) }}>
    <div @class([
        'flex items-center justify-center w-16 h-16 text-primary-500 rounded-full bg-primary-50',
        'dark:bg-gray-700' => config('tables.dark_mode'),
    ])>
        <x-dynamic-component
            :component="$icon"
            class="w-6 h-6"
            wire:loading.remove.delay
            wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
        />

        <x-filament-support::loading-indicator
            class="w-6 h-6"
            wire:loading.delay
            wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
        />
    </div>

    <div class="max-w-md space-y-1">
        <x-tables::empty-state.heading>
            {{ $heading }}
        </x-tables::empty-state.heading>

        @if ($description)
            <x-tables::empty-state.description>
                {{ $description }}
            </x-tables::empty-state.description>
        @endif
    </div>

    @if ($actions)
        <x-tables::actions
            :actions="$actions"
            alignment="center"
            wrap
        />
    @endif

    @if ($columnSearches)
        <x-tables::link
            wire:click="$set('tableColumnSearchQueries', [])"
            color="danger"
            tag="button"
            size="sm"
        >
            {{ __('tables::table.empty.buttons.reset_column_searches.label') }}
        </x-tables::link>
    @endif
</div>
`;
        const output = `@props([
    'actions' => null,
    'columnSearches' => false,
    'description' => null,
    'heading',
    'icon',
])

<div
    {{
        $attributes->class([
            'filament-tables-empty-state flex flex-1 flex-col items-center justify-center p-6 mx-auto space-y-6 text-center bg-white',
            'dark:bg-gray-800' => config('tables.dark_mode'),
        ])
    }}
>
    <div
        @class([
            'flex items-center justify-center w-16 h-16 text-primary-500 rounded-full bg-primary-50',
            'dark:bg-gray-700' => config('tables.dark_mode'),
        ])
    >
        <x-dynamic-component
            :component="$icon"
            class="h-6 w-6"
            wire:loading.remove.delay
            wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
        />

        <x-filament-support::loading-indicator
            class="h-6 w-6"
            wire:loading.delay
            wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
        />
    </div>

    <div class="max-w-md space-y-1">
        <x-tables::empty-state.heading>
            {{ $heading }}
        </x-tables::empty-state.heading>

        @if ($description)
            <x-tables::empty-state.description>
                {{ $description }}
            </x-tables::empty-state.description>
        @endif
    </div>

    @if ($actions)
        <x-tables::actions :actions="$actions" alignment="center" wrap />
    @endif

    @if ($columnSearches)
        <x-tables::link
            wire:click="$set('tableColumnSearchQueries', [])"
            color="danger"
            tag="button"
            size="sm"
        >
            {{ __('tables::table.empty.buttons.reset_column_searches.label') }}
        </x-tables::link>
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});