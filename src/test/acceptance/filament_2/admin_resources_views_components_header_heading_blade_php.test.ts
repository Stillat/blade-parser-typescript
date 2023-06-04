import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: admin_resources_views_components_header_heading_blade_php', () => {
    test('pint: it can format admin_resources_views_components_header_heading_blade_php', () => {
        const input = `<h1 {{ $attributes->class(['filament-header-heading text-2xl font-bold tracking-tight']) }}>
    {{ $slot }}
</h1>
`;
        const output = `<h1
    {{ $attributes->class(['filament-header-heading text-2xl font-bold tracking-tight']) }}
>
    {{ $slot }}
</h1>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});