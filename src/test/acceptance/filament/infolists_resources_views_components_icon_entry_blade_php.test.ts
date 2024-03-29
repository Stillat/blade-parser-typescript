import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_icon_entry_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_icon_entry_blade_php', async () => {
        const input = `<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    <div {{ $attributes
        ->merge($getExtraAttributes(), escape: false)
        ->class([
            'filament-infolists-icon-entry flex flex-wrap gap-1',
        ])
    }}>
        @foreach (\\Illuminate\\Support\\Arr::wrap($getState()) as $state)
            @if ($icon = $getIcon($state))
                <x-filament::icon
                    :name="$icon"
                    alias="filament-infolists::entries.icon"
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
                        'xs' => 'h-3 w-3 filament-infolists-icon-entry-icon-size-xs',
                        'sm' => 'h-4 w-4 filament-infolists-icon-entry-icon-size-sm',
                        'md' => 'h-5 w-5 filament-infolists-icon-entry-icon-size-md',
                        'lg' => 'h-6 w-6 filament-infolists-icon-entry-icon-size-lg',
                        'xl' => 'h-7 w-7 filament-infolists-icon-entry-icon-size-xl',
                        default => $size,
                    }"
                />
            @endif
        @endforeach
    </div>
</x-dynamic-component>
`;
        const output = `<x-dynamic-component :component="$getEntryWrapperView()" :entry="$entry">
    <div
        {{
            $attributes
                ->merge($getExtraAttributes(), escape: false)
                ->class([
                    'filament-infolists-icon-entry flex flex-wrap gap-1',
                ])
        }}
    >
        @foreach (\\Illuminate\\Support\\Arr::wrap($getState()) as $state)
            @if ($icon = $getIcon($state))
                <x-filament::icon
                    :name="$icon"
                    alias="filament-infolists::entries.icon"
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
                            'xs' => 'h-3 w-3 filament-infolists-icon-entry-icon-size-xs',
                            'sm' => 'h-4 w-4 filament-infolists-icon-entry-icon-size-sm',
                            'md' => 'h-5 w-5 filament-infolists-icon-entry-icon-size-md',
                            'lg' => 'h-6 w-6 filament-infolists-icon-entry-icon-size-lg',
                            'xl' => 'h-7 w-7 filament-infolists-icon-entry-icon-size-xl',
                            default => $size,
                        }
                    "
                />
            @endif
        @endforeach
    </div>
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});