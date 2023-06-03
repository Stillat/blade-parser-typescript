import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: support_resources_views_components_input_select_blade_php', () => {
    test('pint: it can format support_resources_views_components_input_select_blade_php', () => {
        const input = `@props([
    'error' => false,
    'prefix' => false,
    'size' => 'md',
    'suffix' => false,
])

<select
    {{ $attributes->class([
        'filament-select-input text-gray-900 block transition duration-75 shadow-sm outline-none sm:text-sm focus:ring-1 focus:ring-inset disabled:opacity-70 dark:bg-gray-700 dark:text-white',
        'h-9 py-1' => $size === 'sm',
        'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-500' => ! $error,
        'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $error,
        'rounded-s-lg' => ! $prefix,
        'rounded-e-lg' => ! $suffix,
    ]) }}
>
    {{ $slot }}
</select>
`;
        const output = `@props([
    'error' => false,
    'prefix' => false,
    'size' => 'md',
    'suffix' => false,
])

<select
    {{
        $attributes->class([
            'filament-select-input text-gray-900 block transition duration-75 shadow-sm outline-none sm:text-sm focus:ring-1 focus:ring-inset disabled:opacity-70 dark:bg-gray-700 dark:text-white',
            'h-9 py-1' => $size === 'sm',
            'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-500' => ! $error,
            'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $error,
            'rounded-s-lg' => ! $prefix,
            'rounded-e-lg' => ! $suffix,
        ])
    }}
>
    {{ $slot }}
</select>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});