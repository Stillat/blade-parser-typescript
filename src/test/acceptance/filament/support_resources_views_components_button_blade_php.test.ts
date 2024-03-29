import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_button_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_button_blade_php', async () => {
        const input = `@props([
    'color' => 'primary',
    'disabled' => false,
    'form' => null,
    'icon' => null,
    'iconPosition' => 'before',
    'iconSize' => null,
    'indicator' => null,
    'indicatorColor' => 'primary',
    'keyBindings' => null,
    'labeledFrom' => null,
    'labelSrOnly' => false,
    'outlined' => false,
    'size' => 'md',
    'tag' => 'button',
    'tooltip' => null,
    'type' => 'button',
])

@php
    $buttonClasses = [
        ...[
            'filament-button grid-flow-col items-center justify-center rounded-lg border font-medium relative outline-none transition-colors focus:ring-2 disabled:pointer-events-none disabled:opacity-70',
            match ($size) {
                'xs' => 'filament-button-size-xs gap-1.5 py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-xs',
                'sm' => 'filament-button-size-sm gap-1.5 py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.[3.5])-1px)] text-sm',
                'md' => 'filament-button-size-md gap-2 py-[calc(theme(spacing[2.5])-1px)] px-[calc(theme(spacing.4)-1px)] text-sm',
                'lg' => 'filament-button-size-lg gap-2 py-[calc(theme(spacing.3)-1px)] px-[calc(theme(spacing.5)-1px)] text-sm',
                'xl' => 'filament-button-size-xl gap-2 py-[calc(theme(spacing.3)-1px)] px-[calc(theme(spacing.6)-1px)] text-base',
            },
            'hidden' => $labeledFrom,
            match ($labeledFrom) {
                'sm' => 'sm:inline-grid',
                'md' => 'md:inline-grid',
                'lg' => 'lg:inline-grid',
                'xl' => 'xl:inline-grid',
                '2xl' => '2xl:inline-grid',
                default => 'inline-grid',
            },
        ],
        ...(
            $outlined
                ? [
                    'filament-button-outlined',
                    match ($color) {
                        'danger' => 'filament-button-color-danger border-danger-600 text-danger-600 hover:bg-danger-500/10 focus:bg-danger-500/10 focus:ring-danger-500/50 dark:border-danger-400 dark:text-danger-400',
                        'gray' => 'filament-button-color-gray border-gray-300 text-gray-700 hover:bg-gray-500/10 focus:bg-gray-500/10 focus:ring-primary-500/50 dark:border-gray-600 dark:text-gray-200',
                        'info' => 'filament-button-color-info border-info-600 text-info-600 hover:bg-info-500/10 focus:bg-info-500/10 focus:ring-info-500/50 dark:border-info-400 dark:text-info-400',
                        'primary' => 'filament-button-color-primary border-primary-600 text-primary-600 hover:bg-primary-500/10 focus:bg-primary-500/10 focus:ring-primary-500/50 dark:border-primary-400 dark:text-primary-400',
                        'secondary' => 'filament-button-color-secondary border-secondary-600 text-secondary-600 hover:bg-secondary-500/10 focus:bg-secondary-500/10 focus:ring-secondary-500/50 dark:border-secondary-400 dark:text-secondary-400',
                        'success' => 'filament-button-color-success border-success-600 text-success-600 hover:bg-success-500/10 focus:bg-success-500/10 focus:ring-success-500/50 dark:border-success-400 dark:text-success-400',
                        'warning' => 'filament-button-color-warning border-warning-600 text-warning-600 hover:bg-warning-500/10 focus:bg-warning-500/10 focus:ring-warning-500/50 dark:border-warning-400 dark:text-warning-400',
                        default => $color,
                    },
                ]
                : [
                    'shadow',
                    match ($color) {
                        'danger' => 'filament-button-color-danger border-transparent bg-danger-600 text-white hover:bg-danger-500 focus:bg-danger-500 focus:ring-danger-500/50',
                        'gray' => 'filament-button-color-gray border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700',
                        'info' => 'filament-button-color-info border-transparent bg-info-600 text-white hover:bg-info-500 focus:bg-info-500 focus:ring-info-500/50',
                        'primary' => 'filament-button-color-primary border-transparent bg-primary-600 text-white hover:bg-primary-500 focus:bg-primary-500 focus:ring-primary-500/50',
                        'secondary' => 'filament-button-color-secondary border-transparent bg-secondary-600 text-white hover:bg-secondary-500 focus:bg-secondary-500 focus:ring-secondary-500/50',
                        'success' => 'filament-button-color-success border-transparent bg-success-600 text-white hover:bg-success-500 focus:bg-success-500 focus:ring-success-500/50',
                        'warning' => 'filament-button-color-warning border-transparent bg-warning-600 text-white hover:bg-warning-500 focus:bg-warning-500 focus:ring-warning-500/50',
                        default => $color,
                    },
                ]
        ),
    ];

    $iconSize ??= match ($size) {
        'xs', 'sm' => 'sm',
        'md', 'lg', 'xl' => 'md',
        default => 'md',
    };

    $iconSize = match ($iconSize) {
        'sm' => 'h-4 w-4',
        'md' => 'h-5 w-5',
        'lg' => 'h-6 w-6',
        default => $iconSize,
    };

    $iconClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-button-icon',
        match ($iconPosition) {
            'before' => match ($size) {
                'xs' => '-ms-0.5',
                'sm' => '-ms-0.5',
                'md' => '-ms-1',
                'lg' => '-ms-1',
                'xl' => '-ms-1',
                default => null,
            },
            'after' => match ($size) {
                'xs' => '-me-0.5',
                'sm' => '-me-0.5',
                'md' => '-me-1',
                'lg' => '-me-1',
                'xl' => '-me-1',
                default => null,
            },
            default => null,
        } => ! $labelSrOnly,
    ]);

    $indicatorClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-button-indicator absolute -top-1 -end-1 inline-flex items-center justify-center h-4 w-4 rounded-full text-[0.5rem] font-medium text-white',
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

    $labelClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-button-label truncate',
        'sr-only' => $labelSrOnly,
    ]);


    $wireTarget = $attributes->whereStartsWith(['wire:target', 'wire:click'])->first();

    $hasFileUploadLoadingIndicator = $type === 'submit' && filled($form);
    $hasLoadingIndicator = filled($wireTarget) || $hasFileUploadLoadingIndicator;

    if ($hasLoadingIndicator) {
        $loadingIndicatorTarget = html_entity_decode($wireTarget ?: $form, ENT_QUOTES);
    }
@endphp

@if ($labeledFrom)
    <x-filament::icon-button
        :color="$color"
        :disabled="$disabled"
        :form="$form"
        :icon="$icon"
        :icon-size="$iconSize"
        :indicator="$indicator"
        :indicator-color="$indicatorColor"
        :key-bindings="$keyBindings"
        :label="$slot"
        :size="$size"
        :tag="$tag"
        :tooltip="$tooltip"
        :type="$type"
        :class="match ($labeledFrom) {
            'sm' => 'sm:hidden',
            'md' => 'md:hidden',
            'lg' => 'lg:hidden',
            'xl' => 'xl:hidden',
            '2xl' => '2xl:hidden',
            default => 'hidden',
        }"
        :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    />
@endif

@if ($tag === 'button')
    <button
        @if (($keyBindings || $tooltip) && (! $hasFileUploadLoadingIndicator))
            x-data="{}"
        @endif
        @if ($keyBindings)
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        @if ($tooltip)
            x-tooltip.raw="{{ $tooltip }}"
        @endif
        @if ($hasFileUploadLoadingIndicator)
            x-data="{
                form: null,
                isUploadingFile: false,
            }"
            x-init="
                form = $el.closest('form')

                form?.addEventListener('file-upload-started', () => {
                    isUploadingFile = true
                })

                form?.addEventListener('file-upload-finished', () => {
                    isUploadingFile = false
                })
            "
            x-bind:class="{ 'enabled:opacity-70 enabled:cursor-wait': isUploadingFile }"
        @endif
        {{
            $attributes
                ->merge([
                    'disabled' => $disabled,
                    'type' => $type,
                    'wire:loading.attr' => 'disabled',
                    'wire:target' => ($hasLoadingIndicator && $loadingIndicatorTarget) ? $loadingIndicatorTarget : null,
                    'x-bind:disabled' => $hasFileUploadLoadingIndicator ? 'isUploadingFile' : false,
                ], escape: false)
                ->class($buttonClasses)
        }}
    >
        @if ($iconPosition === 'before')
            @if ($icon)
                <x-filament::icon
                    :name="$icon"
                    group="support::button.prefix"
                    :size="$iconSize"
                    :class="$iconClasses"
                    :wire:loading.remove.delay="$hasLoadingIndicator"
                    :wire:target="$hasLoadingIndicator ? $loadingIndicatorTarget : null"
                />
            @endif

            @if ($hasLoadingIndicator)
                <x-filament::loading-indicator
                    wire:loading.delay=""
                    :wire:target="$loadingIndicatorTarget"
                    :class="$iconClasses . ' ' . $iconSize"
                />
            @endif

            @if ($hasFileUploadLoadingIndicator)
                <x-filament::loading-indicator
                    x-show="isUploadingFile"
                    x-cloak="x-cloak"
                    :class="$iconClasses . ' ' . $iconSize"
                />
            @endif
        @endif

        <span
            @if ($hasFileUploadLoadingIndicator)
                x-show="!isUploadingFile"
            @endif
            class="{{ $labelClasses }}"
        >
            {{ $slot }}
        </span>

        @if ($hasFileUploadLoadingIndicator)
            <span
                x-show="isUploadingFile"
                x-cloak
            >
                {{ __('filament-support::components/button.messages.uploading_file') }}
            </span>
        @endif

        @if ($iconPosition === 'after')
            @if ($icon)
                <x-filament::icon
                    :name="$icon"
                    group="support::button.suffix"
                    :size="$iconSize"
                    :class="$iconClasses"
                    :wire:loading.remove.delay="$hasLoadingIndicator"
                    :wire:target="$hasLoadingIndicator ? $loadingIndicatorTarget : null"
                />
            @endif

            @if ($hasLoadingIndicator)
                <x-filament::loading-indicator
                    wire:loading.delay=""
                    :wire:target="$loadingIndicatorTarget"
                    :class="$iconClasses . ' ' . $iconSize"
                />
            @endif

            @if ($hasFileUploadLoadingIndicator)
                <x-filament::loading-indicator
                    x-show="isUploadingFile"
                    x-cloak="x-cloak"
                    :class="$iconClasses . ' ' . $iconSize"
                />
            @endif
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
        {{ $attributes->class($buttonClasses) }}
    >
        @if ($icon && $iconPosition === 'before')
            <x-filament::icon
                :name="$icon"
                group="support::button.prefix"
                :size="$iconSize"
                :class="$iconClasses"
            />
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>

        @if ($icon && $iconPosition === 'after')
            <x-filament::icon
                :name="$icon"
                group="support::button.suffix"
                :size="$iconSize"
                :class="$iconClasses"
            />
        @endif

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
    'iconPosition' => 'before',
    'iconSize' => null,
    'indicator' => null,
    'indicatorColor' => 'primary',
    'keyBindings' => null,
    'labeledFrom' => null,
    'labelSrOnly' => false,
    'outlined' => false,
    'size' => 'md',
    'tag' => 'button',
    'tooltip' => null,
    'type' => 'button',
])

@php
    $buttonClasses = [
        ...[
            'filament-button relative grid-flow-col items-center justify-center rounded-lg border font-medium outline-none transition-colors focus:ring-2 disabled:pointer-events-none disabled:opacity-70',
            match ($size) {
                'xs' => 'filament-button-size-xs gap-1.5 px-[calc(theme(spacing.3)-1px)] py-[calc(theme(spacing.2)-1px)] text-xs',
                'sm' => 'filament-button-size-sm gap-1.5 px-[calc(theme(spacing.[3.5])-1px)] py-[calc(theme(spacing.2)-1px)] text-sm',
                'md' => 'filament-button-size-md gap-2 px-[calc(theme(spacing.4)-1px)] py-[calc(theme(spacing[2.5])-1px)] text-sm',
                'lg' => 'filament-button-size-lg gap-2 px-[calc(theme(spacing.5)-1px)] py-[calc(theme(spacing.3)-1px)] text-sm',
                'xl' => 'filament-button-size-xl gap-2 px-[calc(theme(spacing.6)-1px)] py-[calc(theme(spacing.3)-1px)] text-base',
            },
            'hidden' => $labeledFrom,
            match ($labeledFrom) {
                'sm' => 'sm:inline-grid',
                'md' => 'md:inline-grid',
                'lg' => 'lg:inline-grid',
                'xl' => 'xl:inline-grid',
                '2xl' => '2xl:inline-grid',
                default => 'inline-grid',
            },
        ],
        ...(
            $outlined
                ? [
                    'filament-button-outlined',
                    match ($color) {
                        'danger' => 'filament-button-color-danger border-danger-600 text-danger-600 hover:bg-danger-500/10 focus:bg-danger-500/10 focus:ring-danger-500/50 dark:border-danger-400 dark:text-danger-400',
                        'gray' => 'filament-button-color-gray focus:ring-primary-500/50 border-gray-300 text-gray-700 hover:bg-gray-500/10 focus:bg-gray-500/10 dark:border-gray-600 dark:text-gray-200',
                        'info' => 'filament-button-color-info border-info-600 text-info-600 hover:bg-info-500/10 focus:bg-info-500/10 focus:ring-info-500/50 dark:border-info-400 dark:text-info-400',
                        'primary' => 'filament-button-color-primary border-primary-600 text-primary-600 hover:bg-primary-500/10 focus:bg-primary-500/10 focus:ring-primary-500/50 dark:border-primary-400 dark:text-primary-400',
                        'secondary' => 'filament-button-color-secondary border-secondary-600 text-secondary-600 hover:bg-secondary-500/10 focus:bg-secondary-500/10 focus:ring-secondary-500/50 dark:border-secondary-400 dark:text-secondary-400',
                        'success' => 'filament-button-color-success border-success-600 text-success-600 hover:bg-success-500/10 focus:bg-success-500/10 focus:ring-success-500/50 dark:border-success-400 dark:text-success-400',
                        'warning' => 'filament-button-color-warning border-warning-600 text-warning-600 hover:bg-warning-500/10 focus:bg-warning-500/10 focus:ring-warning-500/50 dark:border-warning-400 dark:text-warning-400',
                        default => $color,
                    },
                ]
                : [
                    'shadow',
                    match ($color) {
                        'danger' => 'filament-button-color-danger bg-danger-600 hover:bg-danger-500 focus:bg-danger-500 focus:ring-danger-500/50 border-transparent text-white',
                        'gray' => 'filament-button-color-gray focus:ring-primary-500 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:border-transparent focus:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700',
                        'info' => 'filament-button-color-info bg-info-600 hover:bg-info-500 focus:bg-info-500 focus:ring-info-500/50 border-transparent text-white',
                        'primary' => 'filament-button-color-primary bg-primary-600 hover:bg-primary-500 focus:bg-primary-500 focus:ring-primary-500/50 border-transparent text-white',
                        'secondary' => 'filament-button-color-secondary bg-secondary-600 hover:bg-secondary-500 focus:bg-secondary-500 focus:ring-secondary-500/50 border-transparent text-white',
                        'success' => 'filament-button-color-success bg-success-600 hover:bg-success-500 focus:bg-success-500 focus:ring-success-500/50 border-transparent text-white',
                        'warning' => 'filament-button-color-warning bg-warning-600 hover:bg-warning-500 focus:bg-warning-500 focus:ring-warning-500/50 border-transparent text-white',
                        default => $color,
                    },
                ]
        ),
    ];

    $iconSize ??= match ($size) {
        'xs', 'sm' => 'sm',
        'md', 'lg', 'xl' => 'md',
        default => 'md',
    };

    $iconSize = match ($iconSize) {
        'sm' => 'h-4 w-4',
        'md' => 'h-5 w-5',
        'lg' => 'h-6 w-6',
        default => $iconSize,
    };

    $iconClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-button-icon',
        match ($iconPosition) {
            'before' => match ($size) {
                'xs' => '-ms-0.5',
                'sm' => '-ms-0.5',
                'md' => '-ms-1',
                'lg' => '-ms-1',
                'xl' => '-ms-1',
                default => null,
            },
            'after' => match ($size) {
                'xs' => '-me-0.5',
                'sm' => '-me-0.5',
                'md' => '-me-1',
                'lg' => '-me-1',
                'xl' => '-me-1',
                default => null,
            },
            default => null,
        } => ! $labelSrOnly,
    ]);

    $indicatorClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-button-indicator absolute -top-1 -end-1 inline-flex items-center justify-center h-4 w-4 rounded-full text-[0.5rem] font-medium text-white',
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

    $labelClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-button-label truncate',
        'sr-only' => $labelSrOnly,
    ]);

    $wireTarget = $attributes->whereStartsWith(['wire:target', 'wire:click'])->first();

    $hasFileUploadLoadingIndicator = $type === 'submit' && filled($form);
    $hasLoadingIndicator = filled($wireTarget) || $hasFileUploadLoadingIndicator;

    if ($hasLoadingIndicator) {
        $loadingIndicatorTarget = html_entity_decode($wireTarget ?: $form, ENT_QUOTES);
    }
@endphp

@if ($labeledFrom)
    <x-filament::icon-button
        :color="$color"
        :disabled="$disabled"
        :form="$form"
        :icon="$icon"
        :icon-size="$iconSize"
        :indicator="$indicator"
        :indicator-color="$indicatorColor"
        :key-bindings="$keyBindings"
        :label="$slot"
        :size="$size"
        :tag="$tag"
        :tooltip="$tooltip"
        :type="$type"
        :class="
            match ($labeledFrom) {
                'sm' => 'sm:hidden',
                'md' => 'md:hidden',
                'lg' => 'lg:hidden',
                'xl' => 'xl:hidden',
                '2xl' => '2xl:hidden',
                default => 'hidden',
            }
        "
        :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)"
    />
@endif

@if ($tag === 'button')
    <button
        @if (($keyBindings || $tooltip) && (! $hasFileUploadLoadingIndicator))
            x-data="{}"
        @endif
        @if ($keyBindings)
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        @if ($tooltip)
            x-tooltip.raw="{{ $tooltip }}"
        @endif
        @if ($hasFileUploadLoadingIndicator)
            x-data="{
                form: null,
                isUploadingFile: false,
            }"
            x-init="
                form = $el.closest('form')

                form?.addEventListener('file-upload-started', () => {
                    isUploadingFile = true
                })

                form?.addEventListener('file-upload-finished', () => {
                    isUploadingFile = false
                })
            "
            x-bind:class="{ 'enabled:opacity-70 enabled:cursor-wait': isUploadingFile }"
        @endif
        {{
            $attributes
                ->merge([
                    'disabled' => $disabled,
                    'type' => $type,
                    'wire:loading.attr' => 'disabled',
                    'wire:target' => ($hasLoadingIndicator && $loadingIndicatorTarget) ? $loadingIndicatorTarget : null,
                    'x-bind:disabled' => $hasFileUploadLoadingIndicator ? 'isUploadingFile' : false,
                ], escape: false)
                ->class($buttonClasses)
        }}
    >
        @if ($iconPosition === 'before')
            @if ($icon)
                <x-filament::icon
                    :name="$icon"
                    group="support::button.prefix"
                    :size="$iconSize"
                    :class="$iconClasses"
                    :wire:loading.remove.delay="$hasLoadingIndicator"
                    :wire:target="$hasLoadingIndicator ? $loadingIndicatorTarget : null"
                />
            @endif

            @if ($hasLoadingIndicator)
                <x-filament::loading-indicator
                    wire:loading.delay=""
                    :wire:target="$loadingIndicatorTarget"
                    :class="$iconClasses.' '.$iconSize"
                />
            @endif

            @if ($hasFileUploadLoadingIndicator)
                <x-filament::loading-indicator
                    x-show="isUploadingFile"
                    x-cloak="x-cloak"
                    :class="$iconClasses.' '.$iconSize"
                />
            @endif
        @endif

        <span
            @if ($hasFileUploadLoadingIndicator)
                x-show="!isUploadingFile"
            @endif
            class="{{ $labelClasses }}"
        >
            {{ $slot }}
        </span>

        @if ($hasFileUploadLoadingIndicator)
            <span x-show="isUploadingFile" x-cloak>
                {{ __('filament-support::components/button.messages.uploading_file') }}
            </span>
        @endif

        @if ($iconPosition === 'after')
            @if ($icon)
                <x-filament::icon
                    :name="$icon"
                    group="support::button.suffix"
                    :size="$iconSize"
                    :class="$iconClasses"
                    :wire:loading.remove.delay="$hasLoadingIndicator"
                    :wire:target="$hasLoadingIndicator ? $loadingIndicatorTarget : null"
                />
            @endif

            @if ($hasLoadingIndicator)
                <x-filament::loading-indicator
                    wire:loading.delay=""
                    :wire:target="$loadingIndicatorTarget"
                    :class="$iconClasses.' '.$iconSize"
                />
            @endif

            @if ($hasFileUploadLoadingIndicator)
                <x-filament::loading-indicator
                    x-show="isUploadingFile"
                    x-cloak="x-cloak"
                    :class="$iconClasses.' '.$iconSize"
                />
            @endif
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
        {{ $attributes->class($buttonClasses) }}
    >
        @if ($icon && $iconPosition === 'before')
            <x-filament::icon
                :name="$icon"
                group="support::button.prefix"
                :size="$iconSize"
                :class="$iconClasses"
            />
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>

        @if ($icon && $iconPosition === 'after')
            <x-filament::icon
                :name="$icon"
                group="support::button.suffix"
                :size="$iconSize"
                :class="$iconClasses"
            />
        @endif

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