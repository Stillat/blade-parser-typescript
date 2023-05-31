import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_reorder_handle_blade_php', () => {
    test('pint: it can format tables_resources_views_components_reorder_handle_blade_php', () => {
        const input = `<button
    type="button"
    {{
        $attributes->class([
            'filament-tables-reorder-handle text-gray-500 cursor-move transition group-hover:text-primary-500',
            'dark:text-gray-400 dark:group-hover:text-primary-400' => config('tables.dark_mode'),
        ])
    }}
>
    <x-heroicon-s-menu class="block h-4 w-4" />
</button>
`;
        const output = `<button
    type="button"
    {{
        $attributes->class([
            'filament-tables-reorder-handle text-gray-500 cursor-move transition group-hover:text-primary-500',
            'dark:text-gray-400 dark:group-hover:text-primary-400' => config('tables.dark_mode'),
        ])
    }}
>
    <x-heroicon-s-menu class="block h-4 w-4" />
</button>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});