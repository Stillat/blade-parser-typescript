import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_reorder_cell_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_reorder_cell_blade_php', async () => {
        const input = `<td {{ $attributes->class(['filament-tables-reorder-cell w-4 px-4 whitespace-nowrap']) }}>
    {{ $slot }}
</td>
`;
        const output = `<td
    {{ $attributes->class(['filament-tables-reorder-cell w-4 whitespace-nowrap px-4']) }}
>
    {{ $slot }}
</td>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});