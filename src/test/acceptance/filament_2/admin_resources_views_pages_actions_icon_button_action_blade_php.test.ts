import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_pages_actions_icon_button_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_pages_actions_icon_button_action_blade_php', async () => {
        const input = `<x-filament::pages.actions.action
    :action="$action"
    :label="$getLabel()"
    component="filament::icon-button"
    class="filament-page-icon-button-action"
/>
`;
        const output = `<x-filament::pages.actions.action
    :action="$action"
    :label="$getLabel()"
    component="filament::icon-button"
    class="filament-page-icon-button-action"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});