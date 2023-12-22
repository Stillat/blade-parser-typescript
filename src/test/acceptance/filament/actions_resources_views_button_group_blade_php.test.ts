import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: actions_resources_views_button_group_blade_php', () => {
    setupTestHooks();
    test('pint: it can format actions_resources_views_button_group_blade_php', async () => {
        const input = `<x-filament-actions::group
    :group="$group"
    dynamic-component="filament::button"
    :outlined="$isOutlined()"
    :labeled-from="$getLabeledFromBreakpoint()"
    :icon-position="$getIconPosition()"
    :icon-size="$getIconSize()"
    class="filament-actions-button-group"
>
    {{ $getLabel() }}
</x-filament-actions::group>
`;
        const output = `<x-filament-actions::group
    :group="$group"
    dynamic-component="filament::button"
    :outlined="$isOutlined()"
    :labeled-from="$getLabeledFromBreakpoint()"
    :icon-position="$getIconPosition()"
    :icon-size="$getIconSize()"
    class="filament-actions-button-group"
>
    {{ $getLabel() }}
</x-filament-actions::group>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});