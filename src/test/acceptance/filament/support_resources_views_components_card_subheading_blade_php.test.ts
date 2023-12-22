import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_card_subheading_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_card_subheading_blade_php', async () => {
        const input = `<h3 {{ $attributes->class(['filament-card-subheading text-sm text-gray-600 dark:text-gray-400']) }}>
    {{ $slot }}
</h3>
`;
        const output = `<h3
    {{ $attributes->class(['filament-card-subheading text-sm text-gray-600 dark:text-gray-400']) }}
>
    {{ $slot }}
</h3>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});