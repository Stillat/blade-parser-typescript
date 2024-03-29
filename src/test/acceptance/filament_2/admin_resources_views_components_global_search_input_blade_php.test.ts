import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_global_search_input_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_global_search_input_blade_php', async () => {
        const input = `<div {{ $attributes->class(['filament-global-search-input']) }}>
    <label for="globalSearchInput" class="sr-only">
        {{ __('filament::global-search.field.label') }}
    </label>

    <div class="relative group max-w-md">
        <span @class([
            'absolute inset-y-0 left-0 flex items-center justify-center w-10 h-10 text-gray-500 pointer-events-none group-focus-within:text-primary-500',
            'dark:text-gray-400' => config('filament.dark_mode'),
        ])>
            <x-heroicon-o-search class="w-5 h-5" wire:loading.remove.delay wire:target="search" />

            <x-filament-support::loading-indicator class="w-5 h-5" wire:loading.delay wire:target="search" />
        </span>

        <input
            wire:model.debounce.500ms="search"
            id="globalSearchInput"
            placeholder="{{ __('filament::global-search.field.placeholder') }}"
            type="search"
            autocomplete="off"
            @class([
                'block w-full h-10 pl-10 bg-gray-400/10 placeholder-gray-500 border-transparent transition duration-75 rounded-lg outline-none focus:bg-white focus:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500',
                'dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400' => config('filament.dark_mode'),
            ])
        >
    </div>
</div>
`;
        const output = `<div {{ $attributes->class(['filament-global-search-input']) }}>
    <label for="globalSearchInput" class="sr-only">
        {{ __('filament::global-search.field.label') }}
    </label>

    <div class="group relative max-w-md">
        <span
            @class([
                'group-focus-within:text-primary-500 pointer-events-none absolute inset-y-0 left-0 flex h-10 w-10 items-center justify-center text-gray-500',
                'dark:text-gray-400' => config('filament.dark_mode'),
            ])
        >
            <x-heroicon-o-search
                class="h-5 w-5"
                wire:loading.remove.delay
                wire:target="search"
            />

            <x-filament-support::loading-indicator
                class="h-5 w-5"
                wire:loading.delay
                wire:target="search"
            />
        </span>

        <input
            wire:model.debounce.500ms="search"
            id="globalSearchInput"
            placeholder="{{ __('filament::global-search.field.placeholder') }}"
            type="search"
            autocomplete="off"
            @class([
                'focus:border-primary-500 focus:ring-primary-500 block h-10 w-full rounded-lg border-transparent bg-gray-400/10 pl-10 placeholder-gray-500 outline-none transition duration-75 focus:bg-white focus:placeholder-gray-400 focus:ring-1 focus:ring-inset',
                'dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400' => config('filament.dark_mode'),
            ])
        />
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});