import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: support_resources_views_components_input_index_blade_php', () => {
    test('pint: it can format support_resources_views_components_input_index_blade_php', () => {
        const input = `@props([
    'error' => false,
    'prefix' => false,
    'suffix' => false,
])

<input
    {{ $attributes->class([
        'filament-input block w-full transition duration-75 rounded-lg shadow-sm outline-none sm:text-sm focus:ring-1 focus:ring-inset disabled:opacity-70 dark:bg-gray-700 dark:text-white',
        'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-500' => ! $error,
        'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $error,
        'rounded-s-lg' => ! $prefix,
        'rounded-e-lg' => ! $suffix,
    ]) }}
/>
`;
        const output = `@props([
    'error' => false,
    'prefix' => false,
    'suffix' => false,
])

<input
    {{
        $attributes->class([
            'filament-input block w-full rounded-lg shadow-sm outline-none transition duration-75 focus:ring-1 focus:ring-inset disabled:opacity-70 dark:bg-gray-700 dark:text-white sm:text-sm',
            'focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 border-gray-300 dark:border-gray-600' => ! $error,
            'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $error,
            'rounded-s-lg' => ! $prefix,
            'rounded-e-lg' => ! $suffix,
        ])
    }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});