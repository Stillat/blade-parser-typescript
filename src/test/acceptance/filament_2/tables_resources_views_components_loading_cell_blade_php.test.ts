import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_loading_cell_blade_php', () => {
    test('pint: it can format tables_resources_views_components_loading_cell_blade_php', () => {
        const input = `<td {{ $attributes->class(['w-full px-4 py-4 animate-pulse']) }}>
    <div
        @class([
            'h-4 bg-gray-300 rounded-md',
            'dark:bg-gray-600' => config('tables.dark_mode'),
        ])
    ></div>
</td>
`;
        const output = `<td {{ $attributes->class(['w-full px-4 py-4 animate-pulse']) }}>
    <div
        @class([
            'h-4 bg-gray-300 rounded-md',
            'dark:bg-gray-600' => config('tables.dark_mode'),
        ])
    ></div>
</td>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});