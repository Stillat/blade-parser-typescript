import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_entry_wrapper_helper_text_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_entry_wrapper_helper_text_blade_php', async () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});