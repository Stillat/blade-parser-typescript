import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_bulk_actions_trigger_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_bulk_actions_trigger_blade_php', async () => {
        const input = `<x-tables::icon-button
    icon="heroicon-o-dots-vertical"
    :label="__('tables::table.buttons.open_actions.label')"
    x-cloak
    {{ $attributes->class(['filament-tables-bulk-actions-trigger']) }}
/>
`;
        const output = `<x-tables::icon-button
    icon="heroicon-o-dots-vertical"
    :label="__('tables::table.buttons.open_actions.label')"
    x-cloak
    {{ $attributes->class(['filament-tables-bulk-actions-trigger']) }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});