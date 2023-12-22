import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_dropdown_list_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_dropdown_list_index_blade_php', async () => {
        const input = `<x-filament-support::dropdown.list
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    :dark-mode="config('tables.dark_mode')"
>
    {{ $slot }}
</x-filament-support::dropdown.list>
`;
        const output = `<x-filament-support::dropdown.list
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    :dark-mode="config('tables.dark_mode')"
>
    {{ $slot }}
</x-filament-support::dropdown.list>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});