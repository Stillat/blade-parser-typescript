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
    <button {{
        $attributes
            ->merge([
                'disabled' => $disabled || $separator,
                'type' => 'button',
            ], escape: false)
            ->class([
                'filament-tables-pagination-item relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 -my-3 rounded-md outline-none disabled:opacity-70 disabled:pointer-events-none',
                'hover:bg-gray-500/5 focus:bg-primary-500/10 focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-400/5' => (! $active) && (! $disabled) && (! $separator),
                'focus:text-primary-600' => (! $active) && (! $disabled) && (! $icon) && (! $separator),
                'transition' => ((! $active) && (! $disabled) && (! $separator)) || $active,
                'text-primary-600' => ((! $active) && (! $disabled) && $icon && (! $separator)) || $active,
                'filament-tables-pagination-item-active focus:underline bg-primary-500/10 ring-2 ring-primary-500' => $active,
                'filament-tables-pagination-item-disabled' => $disabled,
                'filament-tables-pagination-item-separator cursor-default' => $separator,
            ])
    }}>
        @if ($icon)
            <x-filament::icon
                :name="$icon"
                alias="filament-tables::pagination.item"
                size="h-5 w-5"
                class="rtl:-scale-x-100"
            />
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
        {{
            $attributes
                ->merge([
                    'disabled' => $disabled || $separator,
                    'type' => 'button',
                ], escape: false)
                ->class([
                    'filament-tables-pagination-item relative -my-3 flex h-8 min-w-[2rem] items-center justify-center rounded-md px-1.5 font-medium outline-none disabled:pointer-events-none disabled:opacity-70',
                    'focus:bg-primary-500/10 focus:ring-primary-500 hover:bg-gray-500/5 focus:ring-2 dark:hover:bg-gray-400/5' => (! $active) && (! $disabled) && (! $separator),
                    'focus:text-primary-600' => (! $active) && (! $disabled) && (! $icon) && (! $separator),
                    'transition' => ((! $active) && (! $disabled) && (! $separator)) || $active,
                    'text-primary-600' => ((! $active) && (! $disabled) && $icon && (! $separator)) || $active,
                    'filament-tables-pagination-item-active bg-primary-500/10 ring-primary-500 ring-2 focus:underline' => $active,
                    'filament-tables-pagination-item-disabled' => $disabled,
                    'filament-tables-pagination-item-separator cursor-default' => $separator,
                ])
        }}
    >
        @if ($icon)
            <x-filament::icon
                :name="$icon"
                alias="filament-tables::pagination.item"
                size="h-5 w-5"
                class="rtl:-scale-x-100"
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