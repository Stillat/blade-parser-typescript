import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_components_button_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_button_blade_php', () => {
        const input = `<x-filament-support::button
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    :dark-mode="config('notifications.dark_mode')"
>
    {{ $slot }}
</x-filament-support::button>
`;
        const output = `<x-filament-support::button
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    :dark-mode="config('notifications.dark_mode')"
>
    {{ $slot }}
</x-filament-support::button>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});