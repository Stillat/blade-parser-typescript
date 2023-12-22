import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_reorder_handle_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_reorder_handle_blade_php', async () => {
        const input = `<button {{
    $attributes
        ->merge([
            'type' => 'button',
        ], escape: false)
        ->class(['filament-tables-reorder-handle text-gray-500 cursor-move transition group-hover:text-primary-500 dark:text-gray-400 dark:group-hover:text-primary-400'])
}}>
    <x-filament::icon
        name="heroicon-o-bars-3"
        alias="filament-tables::reorder.handle"
        size="h-4 w-4"
        class="block"
    />
</button>
`;
        const output = `<button
    {{
        $attributes
            ->merge([
                'type' => 'button',
            ], escape: false)
            ->class(['filament-tables-reorder-handle group-hover:text-primary-500 dark:group-hover:text-primary-400 cursor-move text-gray-500 transition dark:text-gray-400'])
    }}
>
    <x-filament::icon
        name="heroicon-o-bars-3"
        alias="filament-tables::reorder.handle"
        size="h-4 w-4"
        class="block"
    />
</button>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});