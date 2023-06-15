import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_color_picker_blade_php', () => {
    test('pint: it can format forms_resources_views_components_color_picker_blade_php', () => {
        const input = `@php
    $affixLabelClasses = [
        'whitespace-nowrap group-focus-within:text-primary-500',
        'text-gray-400' => ! $errors->has($getStatePath()),
        'text-danger-400' => $errors->has($getStatePath()),
        'dark:text-danger-400' => $errors->has($getStatePath()) && config('forms.dark_mode'),
    ];
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :id="$getId()"
    :label="$getLabel()"
    :label-sr-only="$isLabelHidden()"
    :helper-text="$getHelperText()"
    :hint="$getHint()"
    :hint-action="$getHintAction()"
    :hint-color="$getHintColor()"
    :hint-icon="$getHintIcon()"
    :required="$isRequired()"
    :state-path="$getStatePath()"
>
    <div {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-color-picker-component flex items-center space-x-1 rtl:space-x-reverse group']) }}>
        @if (($prefixAction = $getPrefixAction()) && (! $prefixAction->isHidden()))
            {{ $prefixAction }}
        @endif

        @if ($icon = $getPrefixIcon())
            <x-dynamic-component :component="$icon" class="w-5 h-5" />
        @endif

        @if (filled($label = $getPrefixLabel()))
            <span @class($affixLabelClasses)>
                {{ $label }}
            </span>
        @endif

        <div
            x-data="colorPickerFormComponent({
                isAutofocused: @js($isAutofocused()),
                isDisabled: @js($isDisabled()),
                state: $wire.{{ $applyStateBindingModifiers('entangle(\\'' . $getStatePath() . '\\')') }}
            })"
            x-on:keydown.esc="isOpen() && $event.stopPropagation()"
            {{ $getExtraAlpineAttributeBag()->class(['relative flex-1']) }}
        >
            <input
                x-ref="input"
                type="text"
                dusk="filament.forms.{{ $getStatePath() }}"
                id="{{ $getId() }}"
                x-model="state"
                x-on:click="togglePanelVisibility()"
                x-on:keydown.enter.stop.prevent="togglePanelVisibility()"
                autocomplete="off"
                {!! $isDisabled() ? 'disabled' : null !!}
                {!! ($placeholder = $getPlaceholder()) ? "placeholder=\\"{$placeholder}\\"" : null !!}
                @if (! $isConcealed())
                    {!! $isRequired() ? 'required' : null !!}
                @endif
                {{ $getExtraInputAttributeBag()->class([
                    'filament-forms-input text-gray-900 block w-full transition duration-75 rounded-lg shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500 disabled:opacity-70',
                    'dark:bg-gray-700 dark:text-white dark:focus:border-primary-500' => config('forms.dark_mode'),
                    'border-gray-300' => ! $errors->has($getStatePath()),
                    'dark:border-gray-600' => (! $errors->has($getStatePath())) && config('forms.dark_mode'),
                    'border-danger-600 ring-danger-600' => $errors->has($getStatePath()),
                    'dark:border-danger-400 dark:ring-danger-400' => $errors->has($getStatePath()) && config('forms.dark_mode'),
                ]) }}
            />

            <span
                x-cloak
                class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none rtl:right-auto rtl:left-0 rtl:pl-2"
            >
                <span
                    x-bind:style="{ 'background-color': state }"
                    class="filament-forms-color-picker-component-preview relative overflow-hidden rounded-md w-7 h-7"
                ></span>
            </span>

            <div
                x-cloak
                x-ref="panel"
                x-float.placement.bottom-start.offset.flip.shift="{ offset: 8 }"
                wire:ignore.self
                wire:key="{{ $this->id }}.{{ $getStatePath() }}.{{ $field::class }}.panel"
                @class([
                    'hidden absolute z-10 shadow-lg',
                    'opacity-70 pointer-events-none' => $isDisabled(),
                ])
            >
                @php
                    $tag = match ($getFormat()) {
                        'hsl' => 'hsl-string',
                        'rgb' => 'rgb-string',
                        'rgba' => 'rgba-string',
                        default => 'hex',
                    } . '-color-picker';
                @endphp

                <{{ $tag }} color="{{ $getState() }}" />
            </div>
        </div>

        @if (filled($label = $getSuffixLabel()))
            <span @class($affixLabelClasses)>
                {{ $label }}
            </span>
        @endif

        @if ($icon = $getSuffixIcon())
            <x-dynamic-component :component="$icon" class="w-5 h-5" />
        @endif

        @if (($suffixAction = $getSuffixAction()) && (! $suffixAction->isHidden()))
            {{ $suffixAction }}
        @endif
    </div>
</x-dynamic-component>
`;
        const output = `@php
    $affixLabelClasses = [
        'group-focus-within:text-primary-500 whitespace-nowrap',
        'text-gray-400' => ! $errors->has($getStatePath()),
        'text-danger-400' => $errors->has($getStatePath()),
        'dark:text-danger-400' => $errors->has($getStatePath()) && config('forms.dark_mode'),
    ];
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :id="$getId()"
    :label="$getLabel()"
    :label-sr-only="$isLabelHidden()"
    :helper-text="$getHelperText()"
    :hint="$getHint()"
    :hint-action="$getHintAction()"
    :hint-color="$getHintColor()"
    :hint-icon="$getHintIcon()"
    :required="$isRequired()"
    :state-path="$getStatePath()"
>
    <div
        {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-color-picker-component group flex items-center space-x-1 rtl:space-x-reverse']) }}
    >
        @if (($prefixAction = $getPrefixAction()) && (! $prefixAction->isHidden()))
            {{ $prefixAction }}
        @endif

        @if ($icon = $getPrefixIcon())
            <x-dynamic-component :component="$icon" class="h-5 w-5" />
        @endif

        @if (filled($label = $getPrefixLabel()))
            <span @class($affixLabelClasses)>
                {{ $label }}
            </span>
        @endif

        <div
            x-data="
                colorPickerFormComponent({
                    isAutofocused: @js($isAutofocused()),
                    isDisabled: @js($isDisabled()),
                    state: $wire.{{ $applyStateBindingModifiers('entangle(\\'' . $getStatePath() . '\\')') }},
                })
            "
            x-on:keydown.esc="isOpen() && $event.stopPropagation()"
            {{ $getExtraAlpineAttributeBag()->class(['relative flex-1']) }}
        >
            <input
                x-ref="input"
                type="text"
                dusk="filament.forms.{{ $getStatePath() }}"
                id="{{ $getId() }}"
                x-model="state"
                x-on:click="togglePanelVisibility()"
                x-on:keydown.enter.stop.prevent="togglePanelVisibility()"
                autocomplete="off"
                {!! $isDisabled() ? 'disabled' : null !!}
                {!! ($placeholder = $getPlaceholder()) ? "placeholder=\\"{$placeholder}\\"" : null !!}
                @if (! $isConcealed())
                    {!! $isRequired() ? 'required' : null !!}
                @endif
                {{
                    $getExtraInputAttributeBag()->class([
                        'filament-forms-input focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg text-gray-900 shadow-sm outline-none transition duration-75 focus:ring-1 focus:ring-inset disabled:opacity-70',
                        'dark:focus:border-primary-500 dark:bg-gray-700 dark:text-white' => config('forms.dark_mode'),
                        'border-gray-300' => ! $errors->has($getStatePath()),
                        'dark:border-gray-600' => (! $errors->has($getStatePath())) && config('forms.dark_mode'),
                        'border-danger-600 ring-danger-600' => $errors->has($getStatePath()),
                        'dark:border-danger-400 dark:ring-danger-400' => $errors->has($getStatePath()) && config('forms.dark_mode'),
                    ])
                }}
            />

            <span
                x-cloak
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 rtl:left-0 rtl:right-auto rtl:pl-2"
            >
                <span
                    x-bind:style="{ 'background-color': state }"
                    class="filament-forms-color-picker-component-preview relative h-7 w-7 overflow-hidden rounded-md"
                ></span>
            </span>

            <div
                x-cloak
                x-ref="panel"
                x-float.placement.bottom-start.offset.flip.shift="{ offset: 8 }"
                wire:ignore.self
                wire:key="{{ $this->id }}.{{ $getStatePath() }}.{{ $field::class }}.panel"
                @class([
                    'absolute z-10 hidden shadow-lg',
                    'pointer-events-none opacity-70' => $isDisabled(),
                ])
            >
                @php
                    $tag = match ($getFormat()) {
                        'hsl' => 'hsl-string',
                        'rgb' => 'rgb-string',
                        'rgba' => 'rgba-string',
                        default => 'hex',
                    } . '-color-picker';
                @endphp

                <{{ $tag }} color="{{ $getState() }}" />
            </div>
        </div>

        @if (filled($label = $getSuffixLabel()))
            <span @class($affixLabelClasses)>
                {{ $label }}
            </span>
        @endif

        @if ($icon = $getSuffixIcon())
            <x-dynamic-component :component="$icon" class="h-5 w-5" />
        @endif

        @if (($suffixAction = $getSuffixAction()) && (! $suffixAction->isHidden()))
            {{ $suffixAction }}
        @endif
    </div>
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});