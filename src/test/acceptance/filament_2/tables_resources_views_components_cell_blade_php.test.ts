import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_cell_blade_php', () => {
    test('pint: it can format tables_resources_views_components_cell_blade_php', () => {
        const input = `<td {{ $attributes->class([
    'filament-tables-cell',
    'dark:text-white' => config('tables.dark_mode'),
]) }}>
    {{ $slot }}
</td>
`;
        const output = `<td
    {{
        $attributes->class([
            'filament-tables-cell',
            'dark:text-white' => config('tables.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</td>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});