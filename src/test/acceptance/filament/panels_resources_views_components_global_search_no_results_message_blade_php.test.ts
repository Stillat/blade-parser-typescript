import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: panels_resources_views_components_global_search_no_results_message_blade_php', () => {
    test('pint: it can format panels_resources_views_components_global_search_no_results_message_blade_php', () => {
        const input = `<div {{ $attributes->class(['filament-global-search-no-results-message px-6 py-4 dark:text-gray-200']) }}>
    {{ __('filament::global-search.no_results_message') }}
</div>
`;
        const output = `<div
    {{ $attributes->class(['filament-global-search-no-results-message px-6 py-4 dark:text-gray-200']) }}
>
    {{ __('filament::global-search.no_results_message') }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});