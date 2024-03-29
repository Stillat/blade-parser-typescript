import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_icon_column_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_icon_column_blade_php', async () => {
        const input = `<div {{ $attributes
    ->merge($getExtraAttributes(), escape: false)
    ->class([
        'filament-tables-icon-column flex flex-wrap gap-1',
        'flex-col' => $isListWithLineBreaks(),
        'px-4 py-3' => ! $isInline(),
    ])
}}>
    @foreach (\\Illuminate\\Support\\Arr::wrap($getState()) as $state)
        @if ($icon = $getIcon($state))
            <x-filament::icon
                :name="$icon"
                alias="filament-tables::columns.icon"
                :color="match ($color = $getColor($state)) {
                    'danger' => 'text-danger-500',
                    'gray', null => 'text-gray-500',
                    'info' => 'text-info-500',
                    'primary' => 'text-primary-500',
                    'secondary' => 'text-secondary-500',
                    'success' => 'text-success-500',
                    'warning' => 'text-warning-500',
                    default => $color,
                }"
                :size="match ($size = ($getSize($state) ?? 'lg')) {
                    'xs' => 'h-3 w-3 filament-tables-icon-column-icon-size-xs',
                    'sm' => 'h-4 w-4 filament-tables-icon-column-icon-size-sm',
                    'md' => 'h-5 w-5 filament-tables-icon-column-icon-size-md',
                    'lg' => 'h-6 w-6 filament-tables-icon-column-icon-size-lg',
                    'xl' => 'h-7 w-7 filament-tables-icon-column-icon-size-xl',
                    default => $size,
                }"
            />
        @endif
    @endforeach
</div>
`;
        const output = `<div
    {{
        $attributes
            ->merge($getExtraAttributes(), escape: false)
            ->class([
                'filament-tables-icon-column flex flex-wrap gap-1',
                'flex-col' => $isListWithLineBreaks(),
                'px-4 py-3' => ! $isInline(),
            ])
    }}
>
    @foreach (\\Illuminate\\Support\\Arr::wrap($getState()) as $state)
        @if ($icon = $getIcon($state))
            <x-filament::icon
                :name="$icon"
                alias="filament-tables::columns.icon"
                :color="
                    match ($color = $getColor($state)) {
                        'danger' => 'text-danger-500',
                        'gray', null => 'text-gray-500',
                        'info' => 'text-info-500',
                        'primary' => 'text-primary-500',
                        'secondary' => 'text-secondary-500',
                        'success' => 'text-success-500',
                        'warning' => 'text-warning-500',
                        default => $color,
                    }
                "
                :size="
                    match ($size = ($getSize($state) ?? 'lg')) {
                        'xs' => 'h-3 w-3 filament-tables-icon-column-icon-size-xs',
                        'sm' => 'h-4 w-4 filament-tables-icon-column-icon-size-sm',
                        'md' => 'h-5 w-5 filament-tables-icon-column-icon-size-md',
                        'lg' => 'h-6 w-6 filament-tables-icon-column-icon-size-lg',
                        'xl' => 'h-7 w-7 filament-tables-icon-column-icon-size-xl',
                        default => $size,
                    }
                "
            />
        @endif
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});