import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_actions_icon_button_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_actions_icon_button_action_blade_php', async () => {
        const input = `<x-forms::actions.action
    :action="$action"
    :label="$getLabel()"
    component="forms::icon-button"
    class="filament-forms-icon-button-action -my-2"
/>
`;
        const output = `<x-forms::actions.action
    :action="$action"
    :label="$getLabel()"
    component="forms::icon-button"
    class="filament-forms-icon-button-action -my-2"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});