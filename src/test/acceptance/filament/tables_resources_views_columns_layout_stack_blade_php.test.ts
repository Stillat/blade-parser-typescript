import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_layout_stack_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_layout_stack_blade_php', async () => {
        const input = `<div {{ $attributes
    ->merge($getExtraAttributes(), escape: false)
    ->class([
        'flex flex-col',
        match ($getAlignment()) {
            'center' => 'items-center',
            'end', 'right' => 'items-end',
            'start', 'left', null => 'items-start',
        },
        match ($space = $getSpace()) {
            1 => 'space-y-1',
            2 => 'space-y-2',
            3 => 'space-y-3',
            default => $space,
        },
    ])
}}>
    <x-filament-tables::columns.layout
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
            ->merge($getExtraAttributes(), escape: false)
            ->class([
                'flex flex-col',
                match ($getAlignment()) {
                    'center' => 'items-center',
                    'end', 'right' => 'items-end',
                    'start', 'left', null => 'items-start',
                },
                match ($space = $getSpace()) {
                    1 => 'space-y-1',
                    2 => 'space-y-2',
                    3 => 'space-y-3',
                    default => $space,
                },
            ])
    }}
>
    <x-filament-tables::columns.layout
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