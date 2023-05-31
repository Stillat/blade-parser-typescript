import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: support_resources_views_components_dropdown_list_index_blade_php', () => {
    test('pint: it can format support_resources_views_components_dropdown_list_index_blade_php', () => {
        const input = `<div {{ $attributes->class(['filament-dropdown-list p-1']) }}>
    {{ $slot }}
</div>
`;
        const output = `<div {{ $attributes->class(['filament-dropdown-list p-1']) }}>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});