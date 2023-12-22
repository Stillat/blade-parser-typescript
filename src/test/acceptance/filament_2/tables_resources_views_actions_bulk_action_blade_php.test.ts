import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_actions_bulk_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_actions_bulk_action_blade_php', async () => {
        const input = `<x-tables::dropdown.list.item
    :x-on:click="'mountBulkAction(\\'' . $getName() . '\\')'"
    :icon="$getIcon()"
    :color="$getColor()"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($getExtraAttributeBag())"
    class="filament-tables-bulk-action"
>
    {{ $getLabel() }}
</x-tables::dropdown.list.item>
`;
        const output = `<x-tables::dropdown.list.item
    :x-on:click="'mountBulkAction(\\''.$getName().'\\')'"
    :icon="$getIcon()"
    :color="$getColor()"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($getExtraAttributeBag())"
    class="filament-tables-bulk-action"
>
    {{ $getLabel() }}
</x-tables::dropdown.list.item>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});