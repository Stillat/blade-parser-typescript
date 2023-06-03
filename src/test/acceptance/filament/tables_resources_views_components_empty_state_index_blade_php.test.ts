import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_empty_state_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_empty_state_index_blade_php', () => {
        const input = `@props([
    'actions' => null,
    'description' => null,
    'heading',
    'icon',
])

<div {{ $attributes->class(['filament-tables-empty-state flex flex-1 flex-col items-center justify-center p-6 mx-auto space-y-6 text-center bg-white dark:bg-gray-800']) }}>
    <div class="filament-tables-empty-state-icon-wrapper flex items-center justify-center w-16 h-16 text-primary-500 rounded-full bg-primary-50 dark:bg-gray-700">
        <x-filament::icon
            :name="$icon"
            alias="filament-tables::empty-state"
            size="h-6 w-6"
            wire:loading.remove.delay=""
            :wire:target="implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS)"
        />

        <x-filament::loading-indicator
            class="h-6 w-6"
            wire:loading.delay=""
            wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
        />
    </div>

    <div class="filament-tables-empty-state-textual-content-wrapper max-w-md space-y-1">
        <x-filament-tables::empty-state.heading>
            {{ $heading }}
        </x-filament-tables::empty-state.heading>

        @if ($description)
            <x-filament-tables::empty-state.description>
                {{ $description }}
            </x-filament-tables::empty-state.description>
        @endif
    </div>

    @if ($actions)
        <x-filament-tables::actions
            :actions="$actions"
            alignment="center"
            wrap
        />
    @endif
</div>
`;
        const output = `@props([
    'actions' => null,
    'description' => null,
    'heading',
    'icon',
])

<div
    {{ $attributes->class(['filament-tables-empty-state flex flex-1 flex-col items-center justify-center p-6 mx-auto space-y-6 text-center bg-white dark:bg-gray-800']) }}
>
    <div
        class="filament-tables-empty-state-icon-wrapper flex items-center justify-center w-16 h-16 text-primary-500 rounded-full bg-primary-50 dark:bg-gray-700"
    >
        <x-filament::icon
            :name="$icon"
            alias="filament-tables::empty-state"
            size="h-6 w-6"
            wire:loading.remove.delay=""
            :wire:target="implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS)"
        />

        <x-filament::loading-indicator
            class="h-6 w-6"
            wire:loading.delay=""
            wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
        />
    </div>

    <div
        class="filament-tables-empty-state-textual-content-wrapper max-w-md space-y-1"
    >
        <x-filament-tables::empty-state.heading>
            {{ $heading }}
        </x-filament-tables::empty-state.heading>

        @if ($description)
            <x-filament-tables::empty-state.description>
                {{ $description }}
            </x-filament-tables::empty-state.description>
        @endif
    </div>

    @if ($actions)
        <x-filament-tables::actions
            :actions="$actions"
            alignment="center"
            wrap
        />
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});