import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_header_description_blade_php', () => {
    test('pint: it can format tables_resources_views_components_header_description_blade_php', () => {
        const input = `<p {{ $attributes->class(['filament-tables-header-description']) }}>
    {{ $slot }}
</p>
`;
        const output = `<p {{ $attributes->class(['filament-tables-header-description']) }}>
    {{ $slot }}
</p>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});