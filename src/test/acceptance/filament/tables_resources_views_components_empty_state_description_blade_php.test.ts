import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_empty_state_description_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_empty_state_description_blade_php', async () => {
        const input = `<p {{ $attributes->class(['filament-tables-empty-state-description whitespace-normal text-sm font-medium text-gray-500 dark:text-gray-400']) }}>
    {{ $slot }}
</p>
`;
        const output = `<p
    {{ $attributes->class(['filament-tables-empty-state-description whitespace-normal text-sm font-medium text-gray-500 dark:text-gray-400']) }}
>
    {{ $slot }}
</p>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});