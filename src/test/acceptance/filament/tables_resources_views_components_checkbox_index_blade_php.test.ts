import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_checkbox_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_checkbox_index_blade_php', () => {
        const input = `@props([
    'label' => null
])

<label>
    <input {{ $attributes
        ->merge([
            'type' => 'checkbox',
            'wire:loading.attr' => 'disabled',
            'wire:target' => implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS),
        ], escape: false)
        ->class(['block border-gray-300 rounded shadow-sm text-primary-600 outline-none focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-primary-600 dark:checked:border-primary-600'])
    }} />

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
            $attributes
                ->merge([
                    'type' => 'checkbox',
                    'wire:loading.attr' => 'disabled',
                    'wire:target' => implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS),
                ], escape: false)
                ->class(['block border-gray-300 rounded shadow-sm text-primary-600 outline-none focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-primary-600 dark:checked:border-primary-600'])
        }}
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