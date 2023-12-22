import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_icon_column_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_icon_column_blade_php', async () => {
        const input = `@php
    $size = $getSize() ?? 'lg';
    $stateColor = $getStateColor();
    $stateIcon = $getStateIcon();

    $iconClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        match ($stateColor) {
            'danger' => 'text-danger-500',
            'primary' => 'text-primary-500',
            'success' => 'text-success-500',
            'warning' => 'text-warning-500',
            null => \\Illuminate\\Support\\Arr::toCssClasses(['text-gray-700', 'dark:text-gray-200' => config('tables.dark_mode'),]),
            default => $stateColor,
        },
        match ($size) {
            'xs' => 'h-3 w-3',
            'sm' => 'h-4 w-4',
            'md' => 'h-5 w-5',
            'lg' => 'h-6 w-6',
            'xl' => 'h-7 w-7',
            default => null,
        },
    ]);
@endphp

<div
    {{
        $attributes
            ->merge($getExtraAttributes())
            ->class([
                "filament-tables-icon-column filament-tables-icon-column-size-{$size}",
                'px-4 py-3' => ! $isInline(),
            ])
    }}
>
    @if ($stateIcon)
        <x-dynamic-component
            :component="$stateIcon"
            :class="$iconClasses"
        />
    @endif
</div>
`;
        const output = `@php
    $size = $getSize() ?? 'lg';
    $stateColor = $getStateColor();
    $stateIcon = $getStateIcon();

    $iconClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        match ($stateColor) {
            'danger' => 'text-danger-500',
            'primary' => 'text-primary-500',
            'success' => 'text-success-500',
            'warning' => 'text-warning-500',
            null => \\Illuminate\\Support\\Arr::toCssClasses(['text-gray-700', 'dark:text-gray-200' => config('tables.dark_mode')]),
            default => $stateColor,
        },
        match ($size) {
            'xs' => 'h-3 w-3',
            'sm' => 'h-4 w-4',
            'md' => 'h-5 w-5',
            'lg' => 'h-6 w-6',
            'xl' => 'h-7 w-7',
            default => null,
        },
    ]);
@endphp

<div
    {{
        $attributes
            ->merge($getExtraAttributes())
            ->class([
                "filament-tables-icon-column filament-tables-icon-column-size-{$size}",
                'px-4 py-3' => ! $isInline(),
            ])
    }}
>
    @if ($stateIcon)
        <x-dynamic-component :component="$stateIcon" :class="$iconClasses" />
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});