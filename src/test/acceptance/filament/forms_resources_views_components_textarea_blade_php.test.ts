import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_textarea_blade_php', () => {
    test('pint: it can format forms_resources_views_components_textarea_blade_php', () => {
        const input = `@php
    $isConcealed = $isConcealed();
    $statePath = $getStatePath();
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <textarea
        @if ($shouldAutosize())
            x-ignore
            ax-load
            ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('textarea', 'filament/forms') }}"
            x-data="textareaFormComponent()"
            x-on:input="render()"
            style="height: 150px"
            {{ $getExtraAlpineAttributeBag() }}
        @endif
        {{
            $attributes
                ->merge([
                    'autocomplete' => $getAutocomplete(),
                    'autofocus' => $isAutofocused(),
                    'cols' => $getCols(),
                    'disabled' => $isDisabled(),
                    'dusk' => "filament.forms.{$statePath}",
                    'id' => $getId(),
                    'maxlength' => (! $isConcealed) ? $getMaxLength() : null,
                    'minlength' => (! $isConcealed) ? $getMinLength() : null,
                    'placeholder' => $getPlaceholder(),
                    'readonly' => $isReadOnly(),
                    'required' => $isRequired() && (! $isConcealed),
                    'rows' => $getRows(),
                    $applyStateBindingModifiers('wire:model') => $statePath,
                ], escape: false)
                ->merge($getExtraAttributes(), escape: false)
                ->merge($getExtraInputAttributes(), escape: false)
                ->class([
                    'filament-forms-textarea-component filament-forms-input block w-full transition duration-75 rounded-lg shadow-sm outline-none sm:text-sm focus:ring-1 focus:ring-inset disabled:opacity-70 dark:bg-gray-700 dark:text-white',
                    'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-500' => ! $errors->has($statePath),
                    'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $errors->has($statePath),
                ])
        }}
    ></textarea>
</x-dynamic-component>
`;
        const output = `@php
    $isConcealed = $isConcealed();
    $statePath = $getStatePath();
@endphp

<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <textarea
        @if ($shouldAutosize())
            x-ignore ax-load
            ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('textarea', 'filament/forms') }}"
            x-data="textareaFormComponent()"
            x-on:input="render()"
            style="height: 150px"
            {{ $getExtraAlpineAttributeBag() }}
        @endif
        {{
            $attributes
                ->merge([
                    'autocomplete' => $getAutocomplete(),
                    'autofocus' => $isAutofocused(),
                    'cols' => $getCols(),
                    'disabled' => $isDisabled(),
                    'dusk' => "filament.forms.{$statePath}",
                    'id' => $getId(),
                    'maxlength' => (! $isConcealed) ? $getMaxLength() : null,
                    'minlength' => (! $isConcealed) ? $getMinLength() : null,
                    'placeholder' => $getPlaceholder(),
                    'readonly' => $isReadOnly(),
                    'required' => $isRequired() && (! $isConcealed),
                    'rows' => $getRows(),
                    $applyStateBindingModifiers('wire:model') => $statePath,
                ], escape: false)
                ->merge($getExtraAttributes(), escape: false)
                ->merge($getExtraInputAttributes(), escape: false)
                ->class([
                    'filament-forms-textarea-component filament-forms-input block w-full rounded-lg shadow-sm outline-none transition duration-75 focus:ring-1 focus:ring-inset disabled:opacity-70 dark:bg-gray-700 dark:text-white sm:text-sm',
                    'focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 border-gray-300 dark:border-gray-600' => ! $errors->has($statePath),
                    'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $errors->has($statePath),
                ])
        }}
    ></textarea>
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});