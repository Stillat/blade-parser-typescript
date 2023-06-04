import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: actions_resources_views_button_group_blade_php', () => {
    test('pint: it can format actions_resources_views_button_group_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});