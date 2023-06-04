import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: infolists_resources_views_components_entry_wrapper_helper_text_blade_php', () => {
    test('pint: it can format infolists_resources_views_components_entry_wrapper_helper_text_blade_php', () => {
        const input = `<div {{ $attributes->class(['filament-infolists-entry-wrapper-helper-text text-sm text-gray-600 dark:text-gray-300']) }}>
    {{ $slot }}
</div>
`;
        const output = `<div
    {{ $attributes->class(['filament-infolists-entry-wrapper-helper-text text-sm text-gray-600 dark:text-gray-300']) }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});