import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_columns_layout_panel_blade_php', () => {
    test('pint: it can format tables_resources_views_columns_layout_panel_blade_php', () => {
        const input = `<div {{ $attributes
    ->merge($getExtraAttributes(), escape: false)
    ->class(['px-4 py-3 bg-gray-100 rounded-lg dark:bg-gray-900'])
}}>
    <x-filament-tables::columns.layout
        :components="$getComponents()"
        :record="$getRecord()"
        :record-key="$recordKey"
    />
</div>
`;
        const output = `<div
    {{
        $attributes
            ->merge($getExtraAttributes(), escape: false)
            ->class(['rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-900'])
    }}
>
    <x-filament-tables::columns.layout
        :components="$getComponents()"
        :record="$getRecord()"
        :record-key="$recordKey"
    />
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});