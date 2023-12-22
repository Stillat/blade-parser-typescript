import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_modal_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_modal_index_blade_php', async () => {
        const input = `@captureSlots([
    'actions',
    'content',
    'footer',
    'header',
    'heading',
    'subheading',
    'trigger',
])

<x-filament-support::modal
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($slots)"
    :dark-mode="config('tables.dark_mode')"
    heading-component="tables::modal.heading"
    hr-component="tables::hr"
    subheading-component="tables::modal.subheading"
>
    {{ $slot }}
</x-filament-support::modal>
`;
        const output = `@captureSlots([
    'actions',
    'content',
    'footer',
    'header',
    'heading',
    'subheading',
    'trigger',
])

<x-filament-support::modal
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($slots)"
    :dark-mode="config('tables.dark_mode')"
    heading-component="tables::modal.heading"
    hr-component="tables::hr"
    subheading-component="tables::modal.subheading"
>
    {{ $slot }}
</x-filament-support::modal>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});