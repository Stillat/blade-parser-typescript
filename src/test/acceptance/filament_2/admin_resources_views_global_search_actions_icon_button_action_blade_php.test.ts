import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: admin_resources_views_global_search_actions_icon_button_action_blade_php', () => {
    test('pint: it can format admin_resources_views_global_search_actions_icon_button_action_blade_php', () => {
        const input = `<x-filament::global-search.actions.action
    :action="$action"
    :label="$getLabel()"
    component="filament::icon-button"
    class="filament-global-search-icon-button-action"
/>
`;
        const output = `<x-filament::global-search.actions.action
    :action="$action"
    :label="$getLabel()"
    component="filament::icon-button"
    class="filament-global-search-icon-button-action"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});