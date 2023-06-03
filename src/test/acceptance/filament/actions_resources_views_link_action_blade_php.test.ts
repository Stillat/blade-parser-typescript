import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: actions_resources_views_link_action_blade_php', () => {
    test('pint: it can format actions_resources_views_link_action_blade_php', () => {
        const input = `<x-filament-actions::action
    :action="$action"
    dynamic-component="filament::link"
    :icon-position="$getIconPosition()"
    :icon-size="$getIconSize()"
    class="filament-actions-link-action"
>
    {{ $getLabel() }}
</x-filament-actions::action>
`;
        const output = `<x-filament-actions::action
    :action="$action"
    dynamic-component="filament::link"
    :icon-position="$getIconPosition()"
    :icon-size="$getIconSize()"
    class="filament-actions-link-action"
>
    {{ $getLabel() }}
</x-filament-actions::action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});