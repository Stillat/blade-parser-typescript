import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_reorder_cell_blade_php', () => {
    test('pint: it can format tables_resources_views_components_reorder_cell_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});