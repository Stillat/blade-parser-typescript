import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_actions_bulk_action_blade_php', () => {
    test('pint: it can format tables_resources_views_actions_bulk_action_blade_php', () => {
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
    :x-on:click="'mountBulkAction(\\'' . $getName() . '\\')'"
    :icon="$getIcon()"
    :color="$getColor()"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($getExtraAttributeBag())"
    class="filament-tables-bulk-action"
>
    {{ $getLabel() }}
</x-tables::dropdown.list.item>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});