import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: actions_resources_views_grouped_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format actions_resources_views_grouped_action_blade_php', async () => {
        const input = `<x-filament-actions::action
    :action="$action"
    dynamic-component="filament::dropdown.list.item"
    :icon="$getGroupedIcon()"
    class="filament-actions-grouped-action"
>
    {{ $getLabel() }}
</x-filament-actions::action>
`;
        const output = `<x-filament-actions::action
    :action="$action"
    dynamic-component="filament::dropdown.list.item"
    :icon="$getGroupedIcon()"
    class="filament-actions-grouped-action"
>
    {{ $getLabel() }}
</x-filament-actions::action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});