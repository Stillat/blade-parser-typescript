import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_components_layouts_card_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_components_layouts_card_blade_php', async () => {
        const input = `@props([
    'after' => null,
    'heading' => null,
    'subheading' => null,
])

<x-filament::layouts.base :livewire="$livewire">
    <div class="filament-card-layout flex items-center justify-center min-h-screen py-14">
        <div @class([
            'w-screen px-6 space-y-8 md:mt-0 md:px-2',
            match ($width = $livewire->getCardWidth()) {
                'xs' => 'max-w-xs',
                'sm' => 'max-w-sm',
                'md' => 'max-w-md',
                'lg' => 'max-w-lg',
                'xl' => 'max-w-xl',
                '2xl' => 'max-w-2xl',
                '3xl' => 'max-w-3xl',
                '4xl' => 'max-w-4xl',
                '5xl' => 'max-w-5xl',
                '6xl' => 'max-w-6xl',
                '7xl' => 'max-w-7xl',
                default => $width,
            },
        ])>
            <div class="filament-card-layout-card relative space-y-4 rounded-xl bg-white/50 p-8 shadow-2xl ring-1 ring-gray-950/5 backdrop-blur-xl dark:bg-gray-900/50 dark:ring-white/20">
                @if ($livewire->hasLogo())
                    <div class="flex justify-center w-full">
                        <x-filament::logo />
                    </div>
                @endif

                <div class="space-y-2">
                    @if (filled($heading ??= $livewire->getHeading()))
                        <h2 class="text-2xl font-bold tracking-tight text-center">
                            {{ $heading }}
                        </h2>
                    @endif

                    @if (filled($subheading ??= $livewire->getSubHeading()))
                        <h3 class="text-sm text-gray-600 font-medium tracking-tight text-center dark:text-gray-300">
                            {{ $subheading }}
                        </h3>
                    @endif
                </div>

                <div {{ $attributes }}>
                    {{ $slot }}
                </div>
            </div>

            {{ $after }}
        </div>

        @if (filament()->auth()->check())
            <div class="absolute top-0 end-0 flex items-center justify-end p-2 w-full">
                @if (filament()->hasDatabaseNotifications())
                    @livewire('filament.core.database-notifications')
                @endif

                <x-filament::user-menu />
            </div>
        @endif
    </div>
</x-filament::layouts.base>
`;
        const output = `@props([
    'after' => null,
    'heading' => null,
    'subheading' => null,
])

<x-filament::layouts.base :livewire="$livewire">
    <div
        class="filament-card-layout flex min-h-screen items-center justify-center py-14"
    >
        <div
            @class([
                'w-screen space-y-8 px-6 md:mt-0 md:px-2',
                match ($width = $livewire->getCardWidth()) {
                    'xs' => 'max-w-xs',
                    'sm' => 'max-w-sm',
                    'md' => 'max-w-md',
                    'lg' => 'max-w-lg',
                    'xl' => 'max-w-xl',
                    '2xl' => 'max-w-2xl',
                    '3xl' => 'max-w-3xl',
                    '4xl' => 'max-w-4xl',
                    '5xl' => 'max-w-5xl',
                    '6xl' => 'max-w-6xl',
                    '7xl' => 'max-w-7xl',
                    default => $width,
                },
            ])
        >
            <div
                class="filament-card-layout-card relative space-y-4 rounded-xl bg-white/50 p-8 shadow-2xl ring-1 ring-gray-950/5 backdrop-blur-xl dark:bg-gray-900/50 dark:ring-white/20"
            >
                @if ($livewire->hasLogo())
                    <div class="flex w-full justify-center">
                        <x-filament::logo />
                    </div>
                @endif

                <div class="space-y-2">
                    @if (filled($heading ??= $livewire->getHeading()))
                        <h2
                            class="text-center text-2xl font-bold tracking-tight"
                        >
                            {{ $heading }}
                        </h2>
                    @endif

                    @if (filled($subheading ??= $livewire->getSubHeading()))
                        <h3
                            class="text-center text-sm font-medium tracking-tight text-gray-600 dark:text-gray-300"
                        >
                            {{ $subheading }}
                        </h3>
                    @endif
                </div>

                <div {{ $attributes }}>
                    {{ $slot }}
                </div>
            </div>

            {{ $after }}
        </div>

        @if (filament()->auth()->check())
            <div
                class="absolute end-0 top-0 flex w-full items-center justify-end p-2"
            >
                @if (filament()->hasDatabaseNotifications())
                    @livewire('filament.core.database-notifications')
                @endif

                <x-filament::user-menu />
            </div>
        @endif
    </div>
</x-filament::layouts.base>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});