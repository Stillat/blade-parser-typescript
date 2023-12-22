import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_modal_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_modal_index_blade_php', async () => {
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
    :dark-mode="config('notifications.dark_mode')"
    heading-component="notifications::modal.heading"
    hr-component="notifications::hr"
    subheading-component="notifications::modal.subheading"
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
    :dark-mode="config('notifications.dark_mode')"
    heading-component="notifications::modal.heading"
    hr-component="notifications::hr"
    subheading-component="notifications::modal.subheading"
>
    {{ $slot }}
</x-filament-support::modal>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});