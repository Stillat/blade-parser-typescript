import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: widgets_resources_views_table_widget_blade_php', () => {
    setupTestHooks();
    test('pint: it can format widgets_resources_views_table_widget_blade_php', async () => {
        const input = `<x-filament-widgets::widget class="filament-widgets-table-widget">
    {{ $this->table }}
</x-filament-widgets::widget>
`;
        const output = `<x-filament-widgets::widget class="filament-widgets-table-widget">
    {{ $this->table }}
</x-filament-widgets::widget>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});