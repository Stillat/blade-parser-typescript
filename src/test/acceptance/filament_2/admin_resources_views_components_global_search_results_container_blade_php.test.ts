import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_global_search_results_container_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_global_search_results_container_blade_php', async () => {
        const input = `@props([
    'results',
])

<div
    x-data="{ isOpen: true }"
    x-show="isOpen"
    x-on:keydown.escape.window="isOpen = false"
    x-on:click.away="isOpen = false"
    x-on:open-global-search-results.window="isOpen = true"
    {{ $attributes->class(['filament-global-search-results-container absolute right-0 rtl:right-auto rtl:left-0 top-auto z-10 mt-2 shadow-xl overflow-hidden rounded-xl w-screen max-w-xs sm:max-w-lg']) }}
>
    <div @class([
        'overflow-y-scroll overflow-x-hidden max-h-96 bg-white shadow rounded-xl',
        'dark:bg-gray-800' => config('filament.dark_mode'),
    ])>
        @forelse ($results->getCategories() as $group => $groupedResults)
            <x-filament::global-search.result-group :label="$group" :results="$groupedResults" />
        @empty
            <x-filament::global-search.no-results-message />
        @endforelse
    </div>
</div>
`;
        const output = `@props([
    'results',
])

<div
    x-data="{ isOpen: true }"
    x-show="isOpen"
    x-on:keydown.escape.window="isOpen = false"
    x-on:click.away="isOpen = false"
    x-on:open-global-search-results.window="isOpen = true"
    {{ $attributes->class(['filament-global-search-results-container absolute right-0 top-auto z-10 mt-2 w-screen max-w-xs overflow-hidden rounded-xl shadow-xl rtl:left-0 rtl:right-auto sm:max-w-lg']) }}
>
    <div
        @class([
            'max-h-96 overflow-x-hidden overflow-y-scroll rounded-xl bg-white shadow',
            'dark:bg-gray-800' => config('filament.dark_mode'),
        ])
    >
        @forelse ($results->getCategories() as $group => $groupedResults)
            <x-filament::global-search.result-group
                :label="$group"
                :results="$groupedResults"
            />
        @empty
            <x-filament::global-search.no-results-message />
        @endforelse
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});