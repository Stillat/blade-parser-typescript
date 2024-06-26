import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_dropdown_list_item_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_dropdown_list_item_blade_php', async () => {
        const input = `@props([
    'color' => 'primary',
    'detail' => null,
    'disabled' => false,
    'icon' => null,
    'iconSize' => 'md',
    'image' => null,
    'keyBindings' => null,
    'tag' => 'button',
])

@php
    $buttonClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-dropdown-list-item flex w-full items-center gap-2 whitespace-nowrap rounded-md p-2 text-sm transition-colors outline-none disabled:pointer-events-none disabled:opacity-70',
        match ($color) {
            'danger' => 'filament-dropdown-list-item-color-danger text-danger-600 hover:bg-danger-500/10 focus:bg-danger-500/10 dark:text-danger-400',
            'gray' => 'filament-dropdown-list-item-color-gray text-gray-700 hover:bg-gray-500/10 focus:bg-gray-500/10 dark:text-gray-200',
            'info' => 'filament-dropdown-list-item-color-info text-info-600 hover:bg-info-500/10 focus:bg-info-500/10 dark:text-info-400',
            'primary' => 'filament-dropdown-list-item-color-primary text-primary-600 hover:bg-primary-500/10 focus:bg-primary-500/10 dark:text-primary-400',
            'secondary' => 'filament-dropdown-list-item-color-secondary text-secondary-600 hover:bg-secondary-500/10 focus:bg-secondary-500/10 dark:text-secondary-400',
            'success' => 'filament-dropdown-list-item-color-success text-success-600 hover:bg-success-500/10 focus:bg-success-500/10 dark:text-success-400',
            'warning' => 'filament-dropdown-list-item-color-warning text-warning-600 hover:bg-warning-500/10 focus:bg-warning-500/10 dark:text-warning-400',
            default => $color,
        },
    ]);

    $iconSize = match ($iconSize) {
        'sm' => 'h-4 w-4',
        'md' => 'h-5 w-5',
        'lg' => 'h-6 w-6',
        default => $iconSize,
    };

    $iconClasses = 'filament-dropdown-list-item-icon shrink-0';

    $imageClasses = 'filament-dropdown-list-item-image h-5 w-5 shrink-0 rounded-full bg-gray-200 bg-cover bg-center dark:bg-gray-900';

    $labelClasses = 'filament-dropdown-list-item-label w-full truncate text-start';

    $detailClasses = 'filament-dropdown-list-item-detail ms-auto text-xs';

    $wireTarget = $attributes->whereStartsWith(['wire:target', 'wire:click'])->first();

    $hasLoadingIndicator = filled($wireTarget);

    if ($hasLoadingIndicator) {
        $loadingIndicatorTarget = html_entity_decode($wireTarget, ENT_QUOTES);
    }
@endphp

@if ($tag === 'button')
    <button
        @if ($keyBindings)
            x-data="{}"
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        {{ $attributes
            ->merge([
                'disabled' => $disabled,
                'type' => 'button',
                'wire:loading.attr' => 'disabled',
                'wire:target' => ($hasLoadingIndicator && $loadingIndicatorTarget) ? $loadingIndicatorTarget : null,
            ], escape: false)
            ->class([$buttonClasses])
        }}
    >
        @if ($icon)
            <x-filament::icon
                :name="$icon"
                alias="support::dropdown.list.item"
                :size="$iconSize"
                :class="$iconClasses"
                :wire:loading.remove.delay="$hasLoadingIndicator"
                :wire:target="$hasLoadingIndicator ? $loadingIndicatorTarget : null"
            />
        @endif

        @if ($image)
            <div
                class="{{ $imageClasses }}"
                style="background-image: url('{{ $image }}')"
            ></div>
        @endif

        @if ($hasLoadingIndicator)
            <x-filament::loading-indicator
                wire:loading.delay=""
                :wire:target="$loadingIndicatorTarget"
                :class="$iconClasses . ' ' . $iconSize"
            />
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>

        @if ($detail)
            <span class="{{ $detailClasses }}">
                {{ $detail }}
            </span>
        @endif
    </button>
@elseif ($tag === 'a')
    <a
        @if ($keyBindings)
            x-data="{}"
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        {{ $attributes->class([$buttonClasses]) }}
    >
        @if ($icon)
            <x-filament::icon
                :name="$icon"
                alias="support::dropdown.list.item"
                :size="$iconSize"
                :class="$iconClasses"
            />
        @endif

        @if ($image)
            <div
                class="{{ $imageClasses }}"
                style="background-image: url('{{ $image }}')"
            ></div>
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>

        @if ($detail)
            <span class="{{ $detailClasses }}">
                {{ $detail }}
            </span>
        @endif
    </a>
@elseif ($tag === 'form')
    <form {{ $attributes->only(['action', 'class', 'method', 'wire:submit.prevent']) }}>
        @csrf

        <button
            @if ($keyBindings)
                x-data="{}"
                x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
            @endif
            type="submit"
            {{
                $attributes
                    ->except(['action', 'class', 'method', 'wire:submit.prevent'])
                    ->class([$buttonClasses])
            }}
        >
            @if ($icon)
                <x-filament::icon
                    :name="$icon"
                    alias="support::dropdown.list.item"
                    :size="$iconSize"
                    :class="$iconClasses"
                />
            @endif

            <span class="{{ $labelClasses }}">
                {{ $slot }}
            </span>

            @if ($detail)
                <span class="{{ $detailClasses }}">
                    {{ $detail }}
                </span>
            @endif
        </button>
    </form>
@endif
`;
        const output = `@props([
    'color' => 'primary',
    'detail' => null,
    'disabled' => false,
    'icon' => null,
    'iconSize' => 'md',
    'image' => null,
    'keyBindings' => null,
    'tag' => 'button',
])

@php
    $buttonClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-dropdown-list-item flex w-full items-center gap-2 whitespace-nowrap rounded-md p-2 text-sm transition-colors outline-none disabled:pointer-events-none disabled:opacity-70',
        match ($color) {
            'danger' => 'filament-dropdown-list-item-color-danger text-danger-600 hover:bg-danger-500/10 focus:bg-danger-500/10 dark:text-danger-400',
            'gray' => 'filament-dropdown-list-item-color-gray text-gray-700 hover:bg-gray-500/10 focus:bg-gray-500/10 dark:text-gray-200',
            'info' => 'filament-dropdown-list-item-color-info text-info-600 hover:bg-info-500/10 focus:bg-info-500/10 dark:text-info-400',
            'primary' => 'filament-dropdown-list-item-color-primary text-primary-600 hover:bg-primary-500/10 focus:bg-primary-500/10 dark:text-primary-400',
            'secondary' => 'filament-dropdown-list-item-color-secondary text-secondary-600 hover:bg-secondary-500/10 focus:bg-secondary-500/10 dark:text-secondary-400',
            'success' => 'filament-dropdown-list-item-color-success text-success-600 hover:bg-success-500/10 focus:bg-success-500/10 dark:text-success-400',
            'warning' => 'filament-dropdown-list-item-color-warning text-warning-600 hover:bg-warning-500/10 focus:bg-warning-500/10 dark:text-warning-400',
            default => $color,
        },
    ]);

    $iconSize = match ($iconSize) {
        'sm' => 'h-4 w-4',
        'md' => 'h-5 w-5',
        'lg' => 'h-6 w-6',
        default => $iconSize,
    };

    $iconClasses = 'filament-dropdown-list-item-icon shrink-0';

    $imageClasses = 'filament-dropdown-list-item-image h-5 w-5 shrink-0 rounded-full bg-gray-200 bg-cover bg-center dark:bg-gray-900';

    $labelClasses = 'filament-dropdown-list-item-label w-full truncate text-start';

    $detailClasses = 'filament-dropdown-list-item-detail ms-auto text-xs';

    $wireTarget = $attributes->whereStartsWith(['wire:target', 'wire:click'])->first();

    $hasLoadingIndicator = filled($wireTarget);

    if ($hasLoadingIndicator) {
        $loadingIndicatorTarget = html_entity_decode($wireTarget, ENT_QUOTES);
    }
@endphp

@if ($tag === 'button')
    <button
        @if ($keyBindings)
            x-data="{}"
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        {{
            $attributes
                ->merge([
                    'disabled' => $disabled,
                    'type' => 'button',
                    'wire:loading.attr' => 'disabled',
                    'wire:target' => ($hasLoadingIndicator && $loadingIndicatorTarget) ? $loadingIndicatorTarget : null,
                ], escape: false)
                ->class([$buttonClasses])
        }}
    >
        @if ($icon)
            <x-filament::icon
                :name="$icon"
                alias="support::dropdown.list.item"
                :size="$iconSize"
                :class="$iconClasses"
                :wire:loading.remove.delay="$hasLoadingIndicator"
                :wire:target="$hasLoadingIndicator ? $loadingIndicatorTarget : null"
            />
        @endif

        @if ($image)
            <div
                class="{{ $imageClasses }}"
                style="background-image: url('{{ $image }}')"
            ></div>
        @endif

        @if ($hasLoadingIndicator)
            <x-filament::loading-indicator
                wire:loading.delay=""
                :wire:target="$loadingIndicatorTarget"
                :class="$iconClasses.' '.$iconSize"
            />
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>

        @if ($detail)
            <span class="{{ $detailClasses }}">
                {{ $detail }}
            </span>
        @endif
    </button>
@elseif ($tag === 'a')
    <a
        @if ($keyBindings)
            x-data="{}"
            x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
        @endif
        {{ $attributes->class([$buttonClasses]) }}
    >
        @if ($icon)
            <x-filament::icon
                :name="$icon"
                alias="support::dropdown.list.item"
                :size="$iconSize"
                :class="$iconClasses"
            />
        @endif

        @if ($image)
            <div
                class="{{ $imageClasses }}"
                style="background-image: url('{{ $image }}')"
            ></div>
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>

        @if ($detail)
            <span class="{{ $detailClasses }}">
                {{ $detail }}
            </span>
        @endif
    </a>
@elseif ($tag === 'form')
    <form
        {{ $attributes->only(['action', 'class', 'method', 'wire:submit.prevent']) }}
    >
        @csrf

        <button
            @if ($keyBindings)
                x-data="{}"
                x-mousetrap.global.{{ collect($keyBindings)->map(fn (string $keyBinding): string => str_replace('+', '-', $keyBinding))->implode('.') }}
            @endif
            type="submit"
            {{
                $attributes
                    ->except(['action', 'class', 'method', 'wire:submit.prevent'])
                    ->class([$buttonClasses])
            }}
        >
            @if ($icon)
                <x-filament::icon
                    :name="$icon"
                    alias="support::dropdown.list.item"
                    :size="$iconSize"
                    :class="$iconClasses"
                />
            @endif

            <span class="{{ $labelClasses }}">
                {{ $slot }}
            </span>

            @if ($detail)
                <span class="{{ $detailClasses }}">
                    {{ $detail }}
                </span>
            @endif
        </button>
    </form>
@endif
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});