import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_builder_block_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_builder_block_blade_php', async () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes(), escape: false)->class(['filament-forms-builder-component-block py-8']) }}>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `<div
    {{ $attributes->merge($getExtraAttributes(), escape: false)->class(['filament-forms-builder-component-block py-8']) }}
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});