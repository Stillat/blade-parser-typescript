import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_layout_panel_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_layout_panel_blade_php', async () => {
        const input = `<div
    {{
        $attributes
            ->merge($getExtraAttributes())
            ->class([
                'px-4 py-3 bg-gray-100 rounded-lg',
                'dark:bg-gray-900' => config('forms.dark_mode'),
            ])
    }}
>
    <x-tables::columns.layout
        :components="$getComponents()"
        :record="$getRecord()"
        :record-key="$recordKey"
    />
</div>
`;
        const output = `<div
    {{
        $attributes
            ->merge($getExtraAttributes())
            ->class([
                'rounded-lg bg-gray-100 px-4 py-3',
                'dark:bg-gray-900' => config('forms.dark_mode'),
            ])
    }}
>
    <x-tables::columns.layout
        :components="$getComponents()"
        :record="$getRecord()"
        :record-key="$recordKey"
    />
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});