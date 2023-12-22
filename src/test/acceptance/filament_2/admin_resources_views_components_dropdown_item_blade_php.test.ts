import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_dropdown_item_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_dropdown_item_blade_php', async () => {
        const input = `@captureSlots([
    'detail',
])

<x-filament::dropdown.list.item :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($slots)">
    {{ $slot }}
</x-filament::dropdown.list.item>
`;
        const output = `@captureSlots([
    'detail',
])

<x-filament::dropdown.list.item
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($slots)"
>
    {{ $slot }}
</x-filament::dropdown.list.item>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});