import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_checkbox_blade_php', () => {
    test('pint: it can format forms_resources_views_components_checkbox_blade_php', () => {
        const input = `<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    @php
        $isInline = $isInline();
        $statePath = $getStatePath();
    @endphp

    @if ($isInline)
        {{-- format-ignore-start --}}<x-slot name="labelPrefix">{{-- format-ignore-end --}}
    @endif
            <input {{
                $attributes
                    ->merge([
                        'autofocus' => $isAutofocused(),
                        'disabled' => $isDisabled(),
                        'dusk' => "filament.forms.{$statePath}",
                        'id' => $getId(),
                        'required' => $isRequired() && (! $isConcealed()),
                        'type' => 'checkbox',
                        'wire:loading.attr' => 'disabled',
                        $applyStateBindingModifiers('wire:model') => $statePath,
                    ], escape: false)
                    ->merge($getExtraAttributes(), escape: false)
                    ->merge($getExtraInputAttributes(), escape: false)
                    ->class([
                        'filament-forms-checkbox-component filament-forms-input text-primary-600 transition duration-75 rounded shadow-sm focus:ring-2 disabled:opacity-70 dark:bg-gray-700 dark:checked:bg-primary-500',
                        'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-500' => ! $errors->has($statePath),
                        'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $errors->has($statePath),
                    ])
            }} />
    @if ($isInline)
        {{-- format-ignore-start --}}</x-slot>{{-- format-ignore-end --}}
    @endif
</x-dynamic-component>
`;
        const output = `<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    @php
        $isInline = $isInline();
        $statePath = $getStatePath();
    @endphp

    @if ($isInline)
        {{-- format-ignore-start --}}<x-slot name="labelPrefix">{{-- format-ignore-end --}}
    @endif

    <input
        {{
            $attributes
                ->merge([
                    'autofocus' => $isAutofocused(),
                    'disabled' => $isDisabled(),
                    'dusk' => "filament.forms.{$statePath}",
                    'id' => $getId(),
                    'required' => $isRequired() && (! $isConcealed()),
                    'type' => 'checkbox',
                    'wire:loading.attr' => 'disabled',
                    $applyStateBindingModifiers('wire:model') => $statePath,
                ], escape: false)
                ->merge($getExtraAttributes(), escape: false)
                ->merge($getExtraInputAttributes(), escape: false)
                ->class([
                    'filament-forms-checkbox-component filament-forms-input text-primary-600 dark:checked:bg-primary-500 rounded shadow-sm transition duration-75 focus:ring-2 disabled:opacity-70 dark:bg-gray-700',
                    'focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 border-gray-300 dark:border-gray-600' => ! $errors->has($statePath),
                    'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $errors->has($statePath),
                ])
        }}
    />
    @if ($isInline)
        {{-- format-ignore-start --}}</x-slot>{{-- format-ignore-end --}}
    @endif
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});