import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: support_resources_views_components_dropdown_header_blade_php', () => {
    test('pint: it can format support_resources_views_components_dropdown_header_blade_php', () => {
        const input = `@props([
    'color' => 'primary',
    'darkMode' => false,
    'icon' => null,
    'tag' => 'div',
])

@php
    $headerClasses = 'filament-dropdown-header flex w-full p-3 text-sm';

    $iconClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-dropdown-header-icon mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0',
        'text-primary-500' => $color === 'primary',
        'text-danger-500' => $color === 'danger',
        'text-gray-500' => $color === 'secondary',
        'text-success-500' => $color === 'success',
        'text-warning-500' => $color === 'warning',
    ]);

    $labelClasses = 'filament-dropdown-header-label';
@endphp

@if ($tag === 'div')
    <div {{ $attributes->class([$headerClasses]) }}>
        @if ($icon)
            <x-dynamic-component :component="$icon" :class="$iconClasses" />
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>
    </div>
@elseif ($tag === 'a')
    <a {{ $attributes->class([$headerClasses]) }}>
        @if ($icon)
            <x-dynamic-component :component="$icon" :class="$iconClasses" />
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>
    </a>
@endif
`;
        const output = `@props([
    'color' => 'primary',
    'darkMode' => false,
    'icon' => null,
    'tag' => 'div',
])

@php
    $headerClasses = 'filament-dropdown-header flex w-full p-3 text-sm';

    $iconClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-dropdown-header-icon mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0',
        'text-primary-500' => $color === 'primary',
        'text-danger-500' => $color === 'danger',
        'text-gray-500' => $color === 'secondary',
        'text-success-500' => $color === 'success',
        'text-warning-500' => $color === 'warning',
    ]);

    $labelClasses = 'filament-dropdown-header-label';
@endphp

@if ($tag === 'div')
    <div {{ $attributes->class([$headerClasses]) }}>
        @if ($icon)
            <x-dynamic-component :component="$icon" :class="$iconClasses" />
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>
    </div>
@elseif ($tag === 'a')
    <a {{ $attributes->class([$headerClasses]) }}>
        @if ($icon)
            <x-dynamic-component :component="$icon" :class="$iconClasses" />
        @endif

        <span class="{{ $labelClasses }}">
            {{ $slot }}
        </span>
    </a>
@endif
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});