import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: actions_resources_views_grouped_group_blade_php', () => {
    test('pint: it can format actions_resources_views_grouped_group_blade_php', () => {
        const input = `<x-filament-actions::group
    :group="$group"
    dynamic-component="filament::dropdown.list.item"
    :icon="$getGroupedIcon()"
    class="filament-actions-grouped-group"
>
    {{ $getLabel() }}
</x-filament-actions::group>
`;
        const output = `<x-filament-actions::group
    :group="$group"
    dynamic-component="filament::dropdown.list.item"
    :icon="$getGroupedIcon()"
    class="filament-actions-grouped-group"
>
    {{ $getLabel() }}
</x-filament-actions::group>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});