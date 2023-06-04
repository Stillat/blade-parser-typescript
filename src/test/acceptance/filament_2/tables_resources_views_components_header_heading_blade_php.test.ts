import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_header_heading_blade_php', () => {
    test('pint: it can format tables_resources_views_components_header_heading_blade_php', () => {
        const input = `<h2 {{ $attributes->class(['filament-tables-header-heading text-xl font-bold tracking-tight']) }}>
    {{ $slot }}
</h2>
`;
        const output = `<h2
    {{ $attributes->class(['filament-tables-header-heading text-xl font-bold tracking-tight']) }}
>
    {{ $slot }}
</h2>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});