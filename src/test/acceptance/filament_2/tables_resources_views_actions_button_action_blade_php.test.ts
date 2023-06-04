import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_actions_button_action_blade_php', () => {
    test('pint: it can format tables_resources_views_actions_button_action_blade_php', () => {
        const input = `<x-tables::actions.action
    :action="$action"
    component="tables::button"
    :outlined="$isOutlined()"
    :icon-position="$getIconPosition()"
    class="filament-tables-button-action"
>
    {{ $getLabel() }}
</x-tables::actions.action>
`;
        const output = `<x-tables::actions.action
    :action="$action"
    component="tables::button"
    :outlined="$isOutlined()"
    :icon-position="$getIconPosition()"
    class="filament-tables-button-action"
>
    {{ $getLabel() }}
</x-tables::actions.action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});