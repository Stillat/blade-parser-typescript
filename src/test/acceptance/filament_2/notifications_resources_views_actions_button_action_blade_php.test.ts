import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: notifications_resources_views_actions_button_action_blade_php', () => {
    test('pint: it can format notifications_resources_views_actions_button_action_blade_php', () => {
        const input = `<x-notifications::actions.action
    :action="$action"
    component="notifications::button"
    :outlined="$isOutlined()"
    :icon-position="$getIconPosition()"
    class="filament-notifications-button-action"
>
    {{ $getLabel() }}
</x-notifications::actions.action>
`;
        const output = `<x-notifications::actions.action
    :action="$action"
    component="notifications::button"
    :outlined="$isOutlined()"
    :icon-position="$getIconPosition()"
    class="filament-notifications-button-action"
>
    {{ $getLabel() }}
</x-notifications::actions.action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});