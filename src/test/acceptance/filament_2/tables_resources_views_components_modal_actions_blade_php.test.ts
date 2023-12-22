import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_modal_actions_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_modal_actions_blade_php', async () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});