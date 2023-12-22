import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_loading_cell_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_loading_cell_blade_php', async () => {
        const input = `<td {{ $attributes->class(['w-full px-4 py-4 animate-pulse']) }}>
    <div class="h-4 bg-gray-300 rounded-md dark:bg-gray-600"></div>
</td>
`;
        const output = `<td {{ $attributes->class(['w-full animate-pulse px-4 py-4']) }}>
    <div class="h-4 rounded-md bg-gray-300 dark:bg-gray-600"></div>
</td>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});