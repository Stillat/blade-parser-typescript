import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_modal_heading_blade_php', () => {
    test('pint: it can format forms_resources_views_components_modal_heading_blade_php', () => {
        const input = `<x-filament-support::modal.heading
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    :dark-mode="config('forms.dark_mode')"
>
    {{ $slot }}
</x-filament-support::modal.heading>
`;
        const output = `<x-filament-support::modal.heading
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    :dark-mode="config('forms.dark_mode')"
>
    {{ $slot }}
</x-filament-support::modal.heading>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});