import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_close_button_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_close_button_blade_php', async () => {
        const input = `<x-heroicon-s-x
    class="filament-notifications-close-button h-4 w-4 cursor-pointer text-gray-400"
    x-on:click="close"
/>
`;
        const output = `<x-heroicon-s-x
    class="filament-notifications-close-button h-4 w-4 cursor-pointer text-gray-400"
    x-on:click="close"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});