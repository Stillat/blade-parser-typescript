import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_field_wrapper_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_field_wrapper_index_blade_php', async () => {
        const input = `@props([
    'id',
    'label' => null,
    'labelPrefix' => null,
    'labelSrOnly' => false,
    'labelSuffix' => null,
    'hasNestedRecursiveValidationRules' => false,
    'helperText' => null,
    'hint' => null,
    'hintColor' => null,
    'hintIcon' => null,
    'hintAction' => null,
    'required' => false,
    'statePath',
])

<div {{ $attributes->class(['filament-forms-field-wrapper']) }}>
    @if ($label && $labelSrOnly)
        <label for="{{ $id }}" class="sr-only">
            {{ $label }}
        </label>
    @endif

    <div class="space-y-2">
        @if (($label && (! $labelSrOnly)) || $labelPrefix || $labelSuffix || $hint || $hintIcon || $hintAction)
            <div class="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                @if ($label && (! $labelSrOnly))
                    <x-forms::field-wrapper.label
                        :for="$id"
                        :error="$errors->has($statePath)"
                        :prefix="$labelPrefix"
                        :required="$required"
                        :suffix="$labelSuffix"
                    >
                        {{ $label }}
                    </x-forms::field-wrapper.label>
                @elseif ($labelPrefix)
                    {{ $labelPrefix }}
                @elseif ($labelSuffix)
                    {{ $labelSuffix }}
                @endif

                @if ($hint || $hintIcon || $hintAction)
                    <x-forms::field-wrapper.hint :action="$hintAction" :color="$hintColor" :icon="$hintIcon">
                        {{ filled($hint) ? ($hint instanceof \\Illuminate\\Support\\HtmlString ? $hint : \\Illuminate\\Support\\Str::of($hint)->markdown()->sanitizeHtml()->toHtmlString()) : null }}
                    </x-forms::field-wrapper.hint>
                @endif
            </div>
        @endif

        {{ $slot }}

            @if ($errors->has($statePath) || ($hasNestedRecursiveValidationRules && $errors->has("{$statePath}.*")))
                <x-forms::field-wrapper.error-message>
                    {{ $errors->first($statePath) ?: ($hasNestedRecursiveValidationRules ? $errors->first("{$statePath}.*") : null) }}
                </x-forms::field-wrapper.error-message>
            @endif

        @if ($helperText)
            <x-forms::field-wrapper.helper-text>
                {{ $helperText instanceof \\Illuminate\\Support\\HtmlString ? $helperText : \\Illuminate\\Support\\Str::of($helperText)->markdown()->sanitizeHtml()->toHtmlString() }}
            </x-forms::field-wrapper.helper-text>
        @endif
    </div>
</div>
`;
        const output = `@props([
    'id',
    'label' => null,
    'labelPrefix' => null,
    'labelSrOnly' => false,
    'labelSuffix' => null,
    'hasNestedRecursiveValidationRules' => false,
    'helperText' => null,
    'hint' => null,
    'hintColor' => null,
    'hintIcon' => null,
    'hintAction' => null,
    'required' => false,
    'statePath',
])

<div {{ $attributes->class(['filament-forms-field-wrapper']) }}>
    @if ($label && $labelSrOnly)
        <label for="{{ $id }}" class="sr-only">
            {{ $label }}
        </label>
    @endif

    <div class="space-y-2">
        @if (($label && (! $labelSrOnly)) || $labelPrefix || $labelSuffix || $hint || $hintIcon || $hintAction)
            <div
                class="flex items-center justify-between space-x-2 rtl:space-x-reverse"
            >
                @if ($label && (! $labelSrOnly))
                    <x-forms::field-wrapper.label
                        :for="$id"
                        :error="$errors->has($statePath)"
                        :prefix="$labelPrefix"
                        :required="$required"
                        :suffix="$labelSuffix"
                    >
                        {{ $label }}
                    </x-forms::field-wrapper.label>
                @elseif ($labelPrefix)
                    {{ $labelPrefix }}
                @elseif ($labelSuffix)
                    {{ $labelSuffix }}
                @endif

                @if ($hint || $hintIcon || $hintAction)
                    <x-forms::field-wrapper.hint
                        :action="$hintAction"
                        :color="$hintColor"
                        :icon="$hintIcon"
                    >
                        {{ filled($hint) ? ($hint instanceof \\Illuminate\\Support\\HtmlString ? $hint : \\Illuminate\\Support\\Str::of($hint)->markdown()->sanitizeHtml()->toHtmlString()) : null }}
                    </x-forms::field-wrapper.hint>
                @endif
            </div>
        @endif

        {{ $slot }}

        @if ($errors->has($statePath) || ($hasNestedRecursiveValidationRules && $errors->has("{$statePath}.*")))
            <x-forms::field-wrapper.error-message>
                {{ $errors->first($statePath) ?: ($hasNestedRecursiveValidationRules ? $errors->first("{$statePath}.*") : null) }}
            </x-forms::field-wrapper.error-message>
        @endif

        @if ($helperText)
            <x-forms::field-wrapper.helper-text>
                {{ $helperText instanceof \\Illuminate\\Support\\HtmlString ? $helperText : \\Illuminate\\Support\\Str::of($helperText)->markdown()->sanitizeHtml()->toHtmlString() }}
            </x-forms::field-wrapper.helper-text>
        @endif
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});