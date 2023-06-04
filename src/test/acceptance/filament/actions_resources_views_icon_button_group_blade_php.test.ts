import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: actions_resources_views_icon_button_group_blade_php', () => {
    test('pint: it can format actions_resources_views_icon_button_group_blade_php', () => {
        const input = `<x-filament-actions::group
    :group="$group"
    :label="$getLabel()"
    :inline="$isInline()"
    dynamic-component="filament::icon-button"
    class="filament-actions-icon-button-group"
/>
`;
        const output = `<x-filament-actions::group
    :group="$group"
    :label="$getLabel()"
    :inline="$isInline()"
    dynamic-component="filament::icon-button"
    class="filament-actions-icon-button-group"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});