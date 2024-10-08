import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_layout_split_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_layout_split_blade_php', async () => {
        const input = `<div
    {{
        $attributes
            ->merge($getExtraAttributes())
            ->class([
                'flex',
                match ($getFromBreakpoint()) {
                    'sm' => 'flex-col gap-1 sm:gap-3 sm:items-center sm:flex-row',
                    'md' => 'flex-col gap-1 md:gap-3 md:items-center md:flex-row',
                    'lg' => 'flex-col gap-1 lg:gap-3 lg:items-center lg:flex-row',
                    'xl' => 'flex-col gap-1 xl:gap-3 xl:items-center xl:flex-row',
                    '2xl' => 'flex-col gap-1 2xl:gap-3 2xl:items-center 2xl:flex-row',
                    default => 'gap-3 items-center',
                },
            ])
    }}
>
    <x-tables::columns.layout
        :components="$getComponents()"
        :record="$getRecord()"
        :record-key="$recordKey"
        :row-loop="$getRowLoop()"
    />
</div>
`;
        const output = `<div
    {{
        $attributes
            ->merge($getExtraAttributes())
            ->class([
                'flex',
                match ($getFromBreakpoint()) {
                    'sm' => 'flex-col gap-1 sm:flex-row sm:items-center sm:gap-3',
                    'md' => 'flex-col gap-1 md:flex-row md:items-center md:gap-3',
                    'lg' => 'flex-col gap-1 lg:flex-row lg:items-center lg:gap-3',
                    'xl' => 'flex-col gap-1 xl:flex-row xl:items-center xl:gap-3',
                    '2xl' => 'flex-col gap-1 2xl:flex-row 2xl:items-center 2xl:gap-3',
                    default => 'items-center gap-3',
                },
            ])
    }}
>
    <x-tables::columns.layout
        :components="$getComponents()"
        :record="$getRecord()"
        :record-key="$recordKey"
        :row-loop="$getRowLoop()"
    />
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});