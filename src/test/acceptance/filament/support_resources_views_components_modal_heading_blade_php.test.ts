import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_modal_heading_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_modal_heading_blade_php', async () => {
        const input = `<h2 {{ $attributes->class(['filament-modal-heading text-xl font-medium tracking-tight']) }}>
    {{ $slot }}
</h2>
`;
        const output = `<h2
    {{ $attributes->class(['filament-modal-heading text-xl font-medium tracking-tight']) }}
>
    {{ $slot }}
</h2>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});