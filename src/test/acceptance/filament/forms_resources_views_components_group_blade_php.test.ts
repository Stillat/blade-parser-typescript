import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_group_blade_php', () => {
    test('pint: it can format forms_resources_views_components_group_blade_php', () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes(), escape: false) }}>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `<div {{ $attributes->merge($getExtraAttributes(), escape: false) }}>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});