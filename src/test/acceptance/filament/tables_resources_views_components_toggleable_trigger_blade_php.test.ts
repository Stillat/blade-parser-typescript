import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_toggleable_trigger_blade_php', () => {
    test('pint: it can format tables_resources_views_components_toggleable_trigger_blade_php', () => {
        const input = `<x-filament::icon-button
    icon="heroicon-m-view-columns"
    icon-alias="tables::column-toggling.trigger"
    color="gray"
    :label="__('filament-tables::table.buttons.toggle_columns.label')"
    {{ $attributes->class(['filament-tables-column-toggling-trigger']) }}
/>
`;
        const output = `<x-filament::icon-button
    icon="heroicon-m-view-columns"
    icon-alias="tables::column-toggling.trigger"
    color="gray"
    :label="__('filament-tables::table.buttons.toggle_columns.label')"
    {{ $attributes->class(['filament-tables-column-toggling-trigger']) }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});