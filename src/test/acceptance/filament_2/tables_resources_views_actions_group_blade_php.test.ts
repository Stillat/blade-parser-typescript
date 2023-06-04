import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_actions_group_blade_php', () => {
    test('pint: it can format tables_resources_views_actions_group_blade_php', () => {
        const input = `<x-filament-support::actions.group
    :actions="$getActions()"
    :dark-mode="config('tables.dark_mode')"
    :color="$getColor()"
    :icon="$getIcon()"
    :label="$getLabel()"
    :size="$getSize()"
    :tooltip="$getTooltip()"
/>
`;
        const output = `<x-filament-support::actions.group
    :actions="$getActions()"
    :dark-mode="config('tables.dark_mode')"
    :color="$getColor()"
    :icon="$getIcon()"
    :label="$getLabel()"
    :size="$getSize()"
    :tooltip="$getTooltip()"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});