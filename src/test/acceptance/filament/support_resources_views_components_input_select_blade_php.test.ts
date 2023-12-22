import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_input_select_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_input_select_blade_php', async () => {
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
            'filament-select-input block text-gray-900 shadow-sm outline-none transition duration-75 focus:ring-1 focus:ring-inset disabled:opacity-70 dark:bg-gray-700 dark:text-white sm:text-sm',
            'h-9 py-1' => $size === 'sm',
            'focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 border-gray-300 dark:border-gray-600' => ! $error,
            'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $error,
            'rounded-s-lg' => ! $prefix,
            'rounded-e-lg' => ! $suffix,
        ])
    }}
>
    {{ $slot }}
</select>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});