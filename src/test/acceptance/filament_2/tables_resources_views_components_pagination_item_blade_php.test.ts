import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_pagination_item_blade_php', () => {
    test('pint: it can format tables_resources_views_components_pagination_item_blade_php', () => {
        const input = `@props([
    'active' => false,
    'disabled' => false,
    'icon' => false,
    'label' => null,
    'separator' => false,
])

<li>
    <button
        @if ($disabled || $separator) disabled @endif
        type="button"
        {{ $attributes->class([
            'filament-tables-pagination-item relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 -my-3 rounded-md outline-none',
            'hover:bg-gray-500/5 focus:bg-primary-500/10 focus:ring-2 focus:ring-primary-500' => (! $active) && (! $disabled) && (! $separator),
            'dark:hover:bg-gray-400/5' => (! $active) && (! $disabled) && (! $separator) && config('tables.dark_mode'),
            'focus:text-primary-600' => (! $active) && (! $disabled) && (! $icon) && (! $separator),
            'transition' => ((! $active) && (! $disabled) && (! $separator)) || $active,
            'text-primary-600' => ((! $active) && (! $disabled) && $icon && (! $separator)) || $active,
            'filament-tables-pagination-item-active focus:underline bg-primary-500/10 ring-2 ring-primary-500' => $active,
            'filament-tables-pagination-item-disabled cursor-not-allowed pointer-events-none opacity-70' => $disabled,
            'filament-tables-pagination-item-separator cursor-default' => $separator,
        ]) }}
    >
        @if ($icon)
            <x-dynamic-component :component="$icon" class="w-5 h-5 rtl:scale-x-[-1]" />
        @endif

        <span>{{ $label ?? ($separator ? '...' : '') }}</span>
    </button>
</li>
`;
        const output = `@props([
    'active' => false,
    'disabled' => false,
    'icon' => false,
    'label' => null,
    'separator' => false,
])

<li>
    <button
        @if ($disabled || $separator) disabled @endif
        type="button"
        {{
            $attributes->class([
                'filament-tables-pagination-item relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 -my-3 rounded-md outline-none',
                'hover:bg-gray-500/5 focus:bg-primary-500/10 focus:ring-2 focus:ring-primary-500' => (! $active) && (! $disabled) && (! $separator),
                'dark:hover:bg-gray-400/5' => (! $active) && (! $disabled) && (! $separator) && config('tables.dark_mode'),
                'focus:text-primary-600' => (! $active) && (! $disabled) && (! $icon) && (! $separator),
                'transition' => ((! $active) && (! $disabled) && (! $separator)) || $active,
                'text-primary-600' => ((! $active) && (! $disabled) && $icon && (! $separator)) || $active,
                'filament-tables-pagination-item-active focus:underline bg-primary-500/10 ring-2 ring-primary-500' => $active,
                'filament-tables-pagination-item-disabled cursor-not-allowed pointer-events-none opacity-70' => $disabled,
                'filament-tables-pagination-item-separator cursor-default' => $separator,
            ])
        }}
    >
        @if ($icon)
            <x-dynamic-component
                :component="$icon"
                class="h-5 w-5 rtl:scale-x-[-1]"
            />
        @endif

        <span>{{ $label ?? ($separator ? '...' : '') }}</span>
    </button>
</li>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});