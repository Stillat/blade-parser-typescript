import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: panels_resources_views_components_global_search_results_container_blade_php', () => {
    test('pint: it can format panels_resources_views_components_global_search_results_container_blade_php', () => {
        const input = `@props([
    'results',
])

<div
    x-data="{ isOpen: true }"
    x-show="isOpen"
    x-on:keydown.escape.window="isOpen = false"
    x-on:click.away="isOpen = false"
    x-on:open-global-search-results.window="isOpen = true"
    {{ $attributes->class(['filament-global-search-results-container absolute end-0 top-auto z-10 mt-2 w-screen max-w-xs overflow-hidden rounded-xl shadow-xl ring-1 ring-gray-950/5 dark:ring-white/20 sm:max-w-lg']) }}
>
    <div class="max-h-96 overflow-x-hidden overflow-y-scroll bg-white dark:bg-gray-800">
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
    {{ $attributes->class(['filament-global-search-results-container absolute end-0 top-auto z-10 mt-2 w-screen max-w-xs overflow-hidden rounded-xl shadow-xl ring-1 ring-gray-950/5 dark:ring-white/20 sm:max-w-lg']) }}
>
    <div
        class="max-h-96 overflow-x-hidden overflow-y-scroll bg-white dark:bg-gray-800"
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});