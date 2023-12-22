import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_pages_actions_grouped_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_pages_actions_grouped_action_blade_php', async () => {
        const input = `<x-filament::pages.actions.action
    :action="$action"
    component="filament::dropdown.list.item"
    :icon="$action->getGroupedIcon()"
    class="filament-grouped-action"
>
    {{ $getLabel() }}
</x-filament::pages.actions.action>
`;
        const output = `<x-filament::pages.actions.action
    :action="$action"
    component="filament::dropdown.list.item"
    :icon="$action->getGroupedIcon()"
    class="filament-grouped-action"
>
    {{ $getLabel() }}
</x-filament::pages.actions.action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});