import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_icon_button_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_icon_button_blade_php', async () => {
        const input = `@props([
    'color' => 'primary',
    'disabled' => false,
    'form' => null,
    'icon' => null,
    'iconAlias' => null,
    'iconSize' => null,
    'indicator' => null,
    'indicatorColor' => 'primary',
    'inline' => false,
    'keyBindings' => null,
    'label' => null,
    'size' => 'md',
    'tag' => 'button',
    'tooltip' => null,
    'type' => 'button',
])

@php
    $iconSize ??= $size;

    $buttonClasses = [
        'filament-icon-button relative flex items-center justify-center outline-none transition disabled:pointer-events-none disabled:opacity-70',
        'rounded-full hover:bg-gray-500/5 dark:hover:bg-gray-300/5' => ! $inline,
        match ($color) {
            'danger' => 'text-danger-500',
            'gray' => 'text-gray-500',
            'info' => 'text-info-500',
            'primary' => 'text-primary-500',
            'secondary' => 'text-secondary-500 dark:text-gray-400',
            'success' => 'text-success-500',
            'warning' => 'text-warning-500',
            default => $color,
        },
        match ($color) {
            'danger' => 'focus:bg-danger-500/10',
            'gray' => 'focus:bg-gray-500/10',
            'info' => 'focus:bg-info-500/10',
            'primary' => 'focus:bg-primary-500/10',
            'secondary' => 'focus:bg-secondary-500/10',
            'success' => 'focus:bg-success-500/10',
            'warning' => 'focus:bg-warning-500/10',
            default => $color,
        } => ! $inline,
        match ($size) {
            'sm' => 'w-8 h-8',
            'sm md:md' => 'w-8 h-8 md:w-10 md:h-10',
            'md' => 'w-10 h-10',
            'lg' => 'w-12 h-12',
            default => $size,
        },
    ];

    $iconSize = match ($iconSize) {
        'sm' => 'h-4 w-4',
        'sm md:md' => 'h-4 w-4 md:h-5 md:w-5',
        'md' => 'h-5 w-5',
        'lg' => 'h-6 w-6',
        default => $iconSize,
    };

    $iconClasses = 'filament-icon-button-icon';

    $indicatorClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-icon-button-indicator absolute -top-0.5 -end-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-[0.5rem] font-medium text-white',
        match ($indicatorColor) {
            'danger' => 'bg-danger-600',
            'gray' => 'bg-gray-600',
            'info' => 'bg-info-600',
            'primary' => 'bg-primary-600',
            'secondary' => 'bg-secondary-600',
            'success' => 'bg-success-600',
            'warning' => 'bg-warning-600',
            default => $indicatorColor,
        },
    ]);

    $wireTarget = $attributes->whereStartsWith(['wire:target', 'wire:click'])->first();

    $hasLoadingIndicator = filled($wireTarget) || ($type === 'submit' && filled($form));

    if ($hasLoadingIndicator) {
        $loadingIndicatorTarget = html_entity_decode($wireTarget ?: $form, ENT_QUOTES);
    }
@endphp

@if ($tag === 'button')
    <button
        @if ($keyBindings || $tooltip)
            x-data="{}"
        @endif
        @if ($keyBindings)
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        @if ($tooltip)
            x-tooltip.raw="{{ $tooltip }}"
        @endif
        {{
            $attributes
                ->merge([
                    'disabled' => $disabled,
                    'title' => $label,
                    'type' => $type,
                ], escape: false)
                ->class($buttonClasses)
        }}
    >
        @if ($label)
            <span class="sr-only">
                {{ $label }}
            </span>
        @endif

        <x-filament::icon
            :name="$icon"
            :alias="$iconAlias"
            group="support::icon-button"
            :size="$iconSize"
            :class="$iconClasses"
            :wire:loading.remove.delay="$hasLoadingIndicator"
            :wire:target="$hasLoadingIndicator ? $loadingIndicatorTarget : null"
        />

        @if ($hasLoadingIndicator)
            <x-filament::loading-indicator
                wire:loading.delay=""
                :wire:target="$loadingIndicatorTarget"
                :class="$iconClasses . ' ' . $iconSize"
            />
        @endif

        @if ($indicator)
            <span class="{{ $indicatorClasses }}">
                {{ $indicator }}
            </span>
        @endif
    </button>
@elseif ($tag === 'a')
    <a
        @if ($keyBindings || $tooltip)
            x-data="{}"
        @endif
        @if ($keyBindings)
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        @if ($tooltip)
            x-tooltip.raw="{{ $tooltip }}"
        @endif
        {{
            $attributes
                ->merge([
                    'title' => $label,
                ], escape: false)
                ->class($buttonClasses)
        }}
    >
        @if ($label)
            <span class="sr-only">
                {{ $label }}
            </span>
        @endif

        <x-filament::icon
            :name="$icon"
            alias="support::icon-button"
            :size="$iconSize"
            :class="$iconClasses"
        />

        @if ($indicator)
            <span class="{{ $indicatorClasses }}">
                {{ $indicator }}
            </span>
        @endif
    </a>
@endif
`;
        const output = `@props([
    'color' => 'primary',
    'disabled' => false,
    'form' => null,
    'icon' => null,
    'iconAlias' => null,
    'iconSize' => null,
    'indicator' => null,
    'indicatorColor' => 'primary',
    'inline' => false,
    'keyBindings' => null,
    'label' => null,
    'size' => 'md',
    'tag' => 'button',
    'tooltip' => null,
    'type' => 'button',
])

@php
    $iconSize ??= $size;

    $buttonClasses = [
        'filament-icon-button relative flex items-center justify-center outline-none transition disabled:pointer-events-none disabled:opacity-70',
        'rounded-full hover:bg-gray-500/5 dark:hover:bg-gray-300/5' => ! $inline,
        match ($color) {
            'danger' => 'text-danger-500',
            'gray' => 'text-gray-500',
            'info' => 'text-info-500',
            'primary' => 'text-primary-500',
            'secondary' => 'text-secondary-500 dark:text-gray-400',
            'success' => 'text-success-500',
            'warning' => 'text-warning-500',
            default => $color,
        },
        match ($color) {
            'danger' => 'focus:bg-danger-500/10',
            'gray' => 'focus:bg-gray-500/10',
            'info' => 'focus:bg-info-500/10',
            'primary' => 'focus:bg-primary-500/10',
            'secondary' => 'focus:bg-secondary-500/10',
            'success' => 'focus:bg-success-500/10',
            'warning' => 'focus:bg-warning-500/10',
            default => $color,
        } => ! $inline,
        match ($size) {
            'sm' => 'h-8 w-8',
            'sm md:md' => 'h-8 w-8 md:h-10 md:w-10',
            'md' => 'h-10 w-10',
            'lg' => 'h-12 w-12',
            default => $size,
        },
    ];

    $iconSize = match ($iconSize) {
        'sm' => 'h-4 w-4',
        'sm md:md' => 'h-4 w-4 md:h-5 md:w-5',
        'md' => 'h-5 w-5',
        'lg' => 'h-6 w-6',
        default => $iconSize,
    };

    $iconClasses = 'filament-icon-button-icon';

    $indicatorClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-icon-button-indicator absolute -top-0.5 -end-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-[0.5rem] font-medium text-white',
        match ($indicatorColor) {
            'danger' => 'bg-danger-600',
            'gray' => 'bg-gray-600',
            'info' => 'bg-info-600',
            'primary' => 'bg-primary-600',
            'secondary' => 'bg-secondary-600',
            'success' => 'bg-success-600',
            'warning' => 'bg-warning-600',
            default => $indicatorColor,
        },
    ]);

    $wireTarget = $attributes->whereStartsWith(['wire:target', 'wire:click'])->first();

    $hasLoadingIndicator = filled($wireTarget) || ($type === 'submit' && filled($form));

    if ($hasLoadingIndicator) {
        $loadingIndicatorTarget = html_entity_decode($wireTarget ?: $form, ENT_QUOTES);
    }
@endphp

@if ($tag === 'button')
    <button
        @if ($keyBindings || $tooltip)
            x-data="{}"
        @endif
        @if ($keyBindings)
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        @if ($tooltip)
            x-tooltip.raw="{{ $tooltip }}"
        @endif
        {{
            $attributes
                ->merge([
                    'disabled' => $disabled,
                    'title' => $label,
                    'type' => $type,
                ], escape: false)
                ->class($buttonClasses)
        }}
    >
        @if ($label)
            <span class="sr-only">
                {{ $label }}
            </span>
        @endif

        <x-filament::icon
            :name="$icon"
            :alias="$iconAlias"
            group="support::icon-button"
            :size="$iconSize"
            :class="$iconClasses"
            :wire:loading.remove.delay="$hasLoadingIndicator"
            :wire:target="$hasLoadingIndicator ? $loadingIndicatorTarget : null"
        />

        @if ($hasLoadingIndicator)
            <x-filament::loading-indicator
                wire:loading.delay=""
                :wire:target="$loadingIndicatorTarget"
                :class="$iconClasses.' '.$iconSize"
            />
        @endif

        @if ($indicator)
            <span class="{{ $indicatorClasses }}">
                {{ $indicator }}
            </span>
        @endif
    </button>
@elseif ($tag === 'a')
    <a
        @if ($keyBindings || $tooltip)
            x-data="{}"
        @endif
        @if ($keyBindings)
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        @if ($tooltip)
            x-tooltip.raw="{{ $tooltip }}"
        @endif
        {{
            $attributes
                ->merge([
                    'title' => $label,
                ], escape: false)
                ->class($buttonClasses)
        }}
    >
        @if ($label)
            <span class="sr-only">
                {{ $label }}
            </span>
        @endif

        <x-filament::icon
            :name="$icon"
            alias="support::icon-button"
            :size="$iconSize"
            :class="$iconClasses"
        />

        @if ($indicator)
            <span class="{{ $indicatorClasses }}">
                {{ $indicator }}
            </span>
        @endif
    </a>
@endif
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});