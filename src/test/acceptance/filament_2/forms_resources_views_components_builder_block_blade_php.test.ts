import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_builder_block_blade_php', () => {
    test('pint: it can format forms_resources_views_components_builder_block_blade_php', () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-builder-component-block py-8']) }}>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `<div
    {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-builder-component-block py-8']) }}
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});