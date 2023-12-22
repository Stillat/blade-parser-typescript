import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_global_search_actions_button_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_global_search_actions_button_action_blade_php', async () => {
        const input = `<x-filament::global-search.actions.action
    :action="$action"
    component="filament::button"
    :outlined="$isOutlined()"
    :icon-position="$getIconPosition()"
    class="filament-global-search-button-action"
>
    {{ $getLabel() }}
</x-filament::global-search.actions.action>
`;
        const output = `<x-filament::global-search.actions.action
    :action="$action"
    component="filament::button"
    :outlined="$isOutlined()"
    :icon-position="$getIconPosition()"
    class="filament-global-search-button-action"
>
    {{ $getLabel() }}
</x-filament::global-search.actions.action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});