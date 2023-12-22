import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_dropdown_header_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_dropdown_header_blade_php', async () => {
        const input = `@captureSlots([
    'detail',
])

<x-filament-support::dropdown.header
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($slots)"
    :dark-mode="config('forms.dark_mode')"
>
    {{ $slot }}
</x-filament-support::dropdown.header>
`;
        const output = `@captureSlots([
    'detail',
])

<x-filament-support::dropdown.header
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($slots)"
    :dark-mode="config('forms.dark_mode')"
>
    {{ $slot }}
</x-filament-support::dropdown.header>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});