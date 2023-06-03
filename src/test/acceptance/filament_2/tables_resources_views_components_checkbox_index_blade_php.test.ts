import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_checkbox_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_checkbox_index_blade_php', () => {
        const input = `@props([
    'label' => null
])

<label>
    <input
        {{ $attributes->class([
            'block border-gray-300 rounded shadow-sm text-primary-600 outline-none focus:ring focus:ring-primary-200 focus:ring-opacity-50',
            'dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-primary-600 dark:checked:border-primary-600' => config('tables.dark_mode'),
        ]) }}
        wire:loading.attr="disabled"
        wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
        type="checkbox"
    />

    <span class="sr-only">
        {{ $label }}
    </span>
</label>
`;
        const output = `@props([
    'label' => null,
])

<label>
    <input
        {{
            $attributes->class([
                'text-primary-600 focus:ring-primary-200 block rounded border-gray-300 shadow-sm outline-none focus:ring focus:ring-opacity-50',
                'dark:checked:bg-primary-600 dark:checked:border-primary-600 dark:border-gray-600 dark:bg-gray-700' => config('tables.dark_mode'),
            ])
        }}
        wire:loading.attr="disabled"
        wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
        type="checkbox"
    />

    <span class="sr-only">
        {{ $label }}
    </span>
</label>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});