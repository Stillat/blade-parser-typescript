import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_card_header_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_card_header_blade_php', async () => {
        const input = `<header {{ $attributes->class(['filament-card-header space-y-1']) }}>
    {{ $slot }}
</header>
`;
        const output = `<header {{ $attributes->class(['filament-card-header space-y-1']) }}>
    {{ $slot }}
</header>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});