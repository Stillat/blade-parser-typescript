import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_widgets_table_widget_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_widgets_table_widget_blade_php', async () => {
        const input = `<x-filament::widget class="filament-widgets-table-widget">
    {{ $this->table }}
</x-filament::widget>
`;
        const output = `<x-filament::widget class="filament-widgets-table-widget">
    {{ $this->table }}
</x-filament::widget>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});