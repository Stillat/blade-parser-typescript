import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: widgets_resources_views_table_widget_blade_php', () => {
    test('pint: it can format widgets_resources_views_table_widget_blade_php', () => {
        const input = `<x-filament-widgets::widget class="filament-widgets-table-widget">
    {{ $this->table }}
</x-filament-widgets::widget>
`;
        const output = `<x-filament-widgets::widget class="filament-widgets-table-widget">
    {{ $this->table }}
</x-filament-widgets::widget>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});