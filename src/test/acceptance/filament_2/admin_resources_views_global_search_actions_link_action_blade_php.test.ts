import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: admin_resources_views_global_search_actions_link_action_blade_php', () => {
    test('pint: it can format admin_resources_views_global_search_actions_link_action_blade_php', () => {
        const input = `<x-filament::global-search.actions.action
    :action="$action"
    component="filament::link"
    :icon-position="$getIconPosition()"
    class="filament-global-search-link-action"
>
    {{ $getLabel() }}
</x-filament::global-search.actions.action>
`;
        const output = `<x-filament::global-search.actions.action
    :action="$action"
    component="filament::link"
    :icon-position="$getIconPosition()"
    class="filament-global-search-link-action"
>
    {{ $getLabel() }}
</x-filament::global-search.actions.action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});