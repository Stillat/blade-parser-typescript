import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_toggleable_trigger_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_toggleable_trigger_blade_php', async () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});