import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_modal_actions_blade_php', () => {
    test('pint: it can format tables_resources_views_components_modal_actions_blade_php', () => {
        const input = `<x-filament-support::modal.actions
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    :alignment="config('tables.layout.actions.modal.actions.alignment')"
    :dark-mode="config('tables.dark_mode')"
>
    {{ $slot }}
</x-filament-support::modal.actions>
`;
        const output = `<x-filament-support::modal.actions
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    :alignment="config('tables.layout.actions.modal.actions.alignment')"
    :dark-mode="config('tables.dark_mode')"
>
    {{ $slot }}
</x-filament-support::modal.actions>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});