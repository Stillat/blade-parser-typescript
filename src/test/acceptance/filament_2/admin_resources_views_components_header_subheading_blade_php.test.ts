import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: admin_resources_views_components_header_subheading_blade_php', () => {
    test('pint: it can format admin_resources_views_components_header_subheading_blade_php', () => {
        const input = `<p {{ $attributes->class(['filament-header-subheading max-w-2xl tracking-tight text-gray-500']) }}>
    {{ $slot }}
</p>
`;
        const output = `<p
    {{ $attributes->class(['filament-header-subheading max-w-2xl tracking-tight text-gray-500']) }}
>
    {{ $slot }}
</p>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});