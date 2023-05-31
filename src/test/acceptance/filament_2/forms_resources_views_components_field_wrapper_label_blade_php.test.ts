import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_field_wrapper_label_blade_php', () => {
    test('pint: it can format forms_resources_views_components_field_wrapper_label_blade_php', () => {
        const input = `@props([
    'error' => false,
    'prefix' => null,
    'required' => false,
    'suffix' => null,
])

<label
    {{ $attributes->class(['filament-forms-field-wrapper-label inline-flex items-center space-x-3 rtl:space-x-reverse']) }}
>
    {{ $prefix }}

    <span
        @class([
            'text-sm font-medium leading-4',
            'text-gray-700' => ! $error,
            'dark:text-gray-300' => (! $error) && config('forms.dark_mode'),
            'text-danger-700' => $error,
            'dark:text-danger-400' => $error && config('forms.dark_mode'),
        ])
    >
        {{-- Deliberately poor formatting to ensure that the asterisk sticks to the final word in the label. --}}
        {{ $slot }}@if ($required)<span class="whitespace-nowrap">
                <sup
                    @class([
                        'font-medium text-danger-700',
                        'dark:text-danger-400' => config('forms.dark_mode'),
                    ])
                >
                    *
                </sup>
            </span>
        @endif
    </span>

    {{ $suffix }}
</label>
`;
        const output = `@props([
    'error' => false,
    'prefix' => null,
    'required' => false,
    'suffix' => null,
])

<label
    {{ $attributes->class(['filament-forms-field-wrapper-label inline-flex items-center space-x-3 rtl:space-x-reverse']) }}
>
    {{ $prefix }}

    <span
        @class([
            'text-sm font-medium leading-4',
            'text-gray-700' => ! $error,
            'dark:text-gray-300' => (! $error) && config('forms.dark_mode'),
            'text-danger-700' => $error,
            'dark:text-danger-400' => $error && config('forms.dark_mode'),
        ])
    >
        {{-- Deliberately poor formatting to ensure that the asterisk sticks to the final word in the label. --}}
        {{ $slot }}@if ($required)<span class="whitespace-nowrap">
                <sup
                    @class([
                        'font-medium text-danger-700',
                        'dark:text-danger-400' => config('forms.dark_mode'),
                    ])
                >
                    *
                </sup>
            </span>
        @endif
    </span>

    {{ $suffix }}
</label>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});