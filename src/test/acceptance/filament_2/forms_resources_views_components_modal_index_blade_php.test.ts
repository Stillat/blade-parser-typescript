import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_modal_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_modal_index_blade_php', async () => {
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
    :dark-mode="config('forms.dark_mode')"
    heading-component="forms::modal.heading"
    hr-component="forms::hr"
    subheading-component="forms::modal.subheading"
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
    :dark-mode="config('forms.dark_mode')"
    heading-component="forms::modal.heading"
    hr-component="forms::hr"
    subheading-component="forms::modal.subheading"
>
    {{ $slot }}
</x-filament-support::modal>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});