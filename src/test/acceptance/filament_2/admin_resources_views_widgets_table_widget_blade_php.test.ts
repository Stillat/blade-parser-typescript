import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: admin_resources_views_widgets_table_widget_blade_php', () => {
    test('pint: it can format admin_resources_views_widgets_table_widget_blade_php', () => {
        const input = `<x-filament::widget class="filament-widgets-table-widget">
    {{ $this->table }}
</x-filament::widget>
`;
        const output = `<x-filament::widget class="filament-widgets-table-widget">
    {{ $this->table }}
</x-filament::widget>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});