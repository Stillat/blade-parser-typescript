import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: admin_resources_views_components_dropdown_list_item_blade_php', () => {
    test('pint: it can format admin_resources_views_components_dropdown_list_item_blade_php', () => {
        const input = `@captureSlots([
    'detail',
])

<x-filament-support::dropdown.list.item
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($slots)"
    :dark-mode="config('filament.dark_mode')"
>
    {{ $slot }}
</x-filament-support::dropdown.list.item>
`;
        const output = `@captureSlots([
    'detail',
])

<x-filament-support::dropdown.list.item
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($slots)"
    :dark-mode="config('filament.dark_mode')"
>
    {{ $slot }}
</x-filament-support::dropdown.list.item>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});