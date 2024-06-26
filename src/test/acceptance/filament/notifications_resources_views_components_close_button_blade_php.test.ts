import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_close_button_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_close_button_blade_php', async () => {
        const input = `<x-filament::icon
    name="heroicon-m-x-mark"
    alias="filament-notifications::notification.close-button"
    color="text-gray-400"
    size="h-5 w-5"
    class="filament-notifications-notification-close-button cursor-pointer"
    x-on:click="close"
/>
`;
        const output = `<x-filament::icon
    name="heroicon-m-x-mark"
    alias="filament-notifications::notification.close-button"
    color="text-gray-400"
    size="h-5 w-5"
    class="filament-notifications-notification-close-button cursor-pointer"
    x-on:click="close"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});