import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: admin_resources_views_pages_actions_link_action_blade_php', () => {
    test('pint: it can format admin_resources_views_pages_actions_link_action_blade_php', () => {
        const input = `<x-filament::pages.actions.action
    :action="$action"
    component="filament::link"
    :icon-position="$getIconPosition()"
    class="filament-page-link-action"
>
    {{ $getLabel() }}
</x-filament::pages.actions.action>
`;
        const output = `<x-filament::pages.actions.action
    :action="$action"
    component="filament::link"
    :icon-position="$getIconPosition()"
    class="filament-page-link-action"
>
    {{ $getLabel() }}
</x-filament::pages.actions.action>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});