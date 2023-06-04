import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: admin_resources_views_pages_actions_grouped_action_blade_php', () => {
    test('pint: it can format admin_resources_views_pages_actions_grouped_action_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});