import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: admin_resources_views_global_search_actions_button_action_blade_php', () => {
    test('pint: it can format admin_resources_views_global_search_actions_button_action_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});