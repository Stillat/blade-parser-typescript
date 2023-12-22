import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_actions_link_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_actions_link_action_blade_php', async () => {
        const input = `<x-notifications::actions.action
    :action="$action"
    component="notifications::link"
    :icon-position="$getIconPosition()"
    class="filament-notifications-link-action"
>
    {{ $getLabel() }}
</x-notifications::actions.action>
`;
        const output = `<x-notifications::actions.action
    :action="$action"
    component="notifications::link"
    :icon-position="$getIconPosition()"
    class="filament-notifications-link-action"
>
    {{ $getLabel() }}
</x-notifications::actions.action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});