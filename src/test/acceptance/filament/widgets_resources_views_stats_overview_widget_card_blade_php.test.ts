import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: widgets_resources_views_stats_overview_widget_card_blade_php', () => {
    test('pint: it can format widgets_resources_views_stats_overview_widget_card_blade_php', () => {
        const input = `@php
    $descriptionIcon = $getDescriptionIcon();
    $descriptionIconPosition = $getDescriptionIconPosition();
    $url = $getUrl();
    $tag = $url ? 'a' : 'div';
@endphp

<{!! $tag !!}
    @if ($url)
        href="{{ $url }}"
        @if ($shouldOpenUrlInNewTab()) target="_blank" @endif
    @endif
    {{ $getExtraAttributeBag()->class(['filament-stats-overview-widget-card relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20']) }}
>
    <div @class([
        'space-y-2',
    ])>
        <div class="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium">
            @if ($icon = $getIcon())
                <x-filament::icon
                    :name="$icon"
                    alias="widgets::stats-overview.card"
                    color="text-gray-500 dark:text-gray-200"
                    size="h-4 w-4"
                />
            @endif

            <span>{{ $getLabel() }}</span>
        </div>

        <div class="text-3xl">
            {{ $getValue() }}
        </div>

        @if ($description = $getDescription())
            <div @class([
                'flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium',
                match ($descriptionColor = $getDescriptionColor()) {
                    'danger' => 'text-danger-600',
                    'gray', null => 'text-gray-600',
                    'info' => 'text-info-600',
                    'primary' => 'text-primary-600',
                    'secondary' => 'text-secondary-600',
                    'success' => 'text-success-600',
                    'warning' => 'text-warning-600',
                    default => $descriptionColor,
                },
            ])>
                @if ($descriptionIcon && ($descriptionIconPosition === 'before'))
                    <x-filament::icon
                        :name="$descriptionIcon"
                        alias="widgets::stats-overview.card.description"
                        size="h-4 w-4"
                    />
                @endif

                <span>{{ $description }}</span>

                @if ($descriptionIcon && ($descriptionIconPosition === 'after'))
                    <x-filament::icon
                        :name="$descriptionIcon"
                        alias="widgets::stats-overview.card.description"
                        size="h-4 w-4"
                    />
                @endif
            </div>
        @endif
    </div>

    @if ($chart = $getChart())
        <div
            x-ignore
            ax-load
            ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('stats-overview/card/chart', 'filament/widgets') }}"
            x-data="statsOverviewCardChart({
                labels: @js(array_keys($chart)),
                values: @js(array_values($chart)),
            })"
            wire:ignore
            x-on:theme-changed.window="
                chart.destroy()
                initChart()
            "
            class="absolute bottom-0 inset-x-0 rounded-b-xl overflow-hidden"
        >
            <canvas
                x-ref="canvas"
                class="h-6"
            ></canvas>

            @php
                $chartColor = $getChartColor();
            @endphp

            <span
                x-ref="backgroundColorElement"
                @class([
                    match ($chartColor) {
                        'danger' => 'text-danger-50 dark:text-danger-700',
                        'gray', null => 'text-gray-50 dark:text-gray-700',
                        'info' => 'text-info-50 dark:text-info-700',
                        'primary' => 'text-primary-50 dark:text-primary-700',
                        'secondary' => 'text-secondary-50 dark:text-secondary-700',
                        'success' => 'text-success-50 dark:text-success-700',
                        'warning' => 'text-warning-50 dark:text-warning-700',
                        default => $chartColor,
                    },
                ])
            ></span>

            <span
                x-ref="borderColorElement"
                @class([
                    match ($chartColor) {
                        'danger' => 'text-danger-400',
                        'gray', null => 'text-gray-400',
                        'info' => 'text-info-400',
                        'primary' => 'text-primary-400',
                        'secondary' => 'text-secondary-400',
                        'success' => 'text-success-400',
                        'warning' => 'text-warning-400',
                        default => $chartColor,
                    },
                ])
            ></span>
        </div>
    @endif
</{!! $tag !!}>

`;
        const output = `@php
    $descriptionIcon = $getDescriptionIcon();
    $descriptionIconPosition = $getDescriptionIconPosition();
    $url = $getUrl();
    $tag = $url ? 'a' : 'div';
@endphp

<{!! $tag !!}
    @if ($url)
        href="{{ $url }}"
        @if ($shouldOpenUrlInNewTab()) target="_blank" @endif
    @endif
    {{ $getExtraAttributeBag()->class(['filament-stats-overview-widget-card relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20']) }}
>
    <div @class([
        'space-y-2',
    ])>
        <div
            class="flex items-center space-x-2 text-sm font-medium rtl:space-x-reverse"
        >
            @if ($icon = $getIcon())
                <x-filament::icon
                    :name="$icon"
                    alias="widgets::stats-overview.card"
                    color="text-gray-500 dark:text-gray-200"
                    size="h-4 w-4"
                />
            @endif

            <span>{{ $getLabel() }}</span>
        </div>

        <div class="text-3xl">
            {{ $getValue() }}
        </div>

        @if ($description = $getDescription())
            <div
                @class([
                    'flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium',
                    match ($descriptionColor = $getDescriptionColor()) {
                        'danger' => 'text-danger-600',
                        'gray', null => 'text-gray-600',
                        'info' => 'text-info-600',
                        'primary' => 'text-primary-600',
                        'secondary' => 'text-secondary-600',
                        'success' => 'text-success-600',
                        'warning' => 'text-warning-600',
                        default => $descriptionColor,
                    },
                ])
            >
                @if ($descriptionIcon && ($descriptionIconPosition === 'before'))
                    <x-filament::icon
                        :name="$descriptionIcon"
                        alias="widgets::stats-overview.card.description"
                        size="h-4 w-4"
                    />
                @endif

                <span>{{ $description }}</span>

                @if ($descriptionIcon && ($descriptionIconPosition === 'after'))
                    <x-filament::icon
                        :name="$descriptionIcon"
                        alias="widgets::stats-overview.card.description"
                        size="h-4 w-4"
                    />
                @endif
            </div>
        @endif
    </div>

    @if ($chart = $getChart())
        <div
            x-ignore
            ax-load
            ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('stats-overview/card/chart', 'filament/widgets') }}"
            x-data="statsOverviewCardChart({
                labels: @js(array_keys($chart)),
                values: @js(array_values($chart)),
            })"
            wire:ignore
            x-on:theme-changed.window="
                chart.destroy()
                initChart()
            "
            class="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-xl"
        >
            <canvas x-ref="canvas" class="h-6"></canvas>

            @php
                $chartColor = $getChartColor();
            @endphp

            <span
                x-ref="backgroundColorElement"
                @class([
                    match ($chartColor) {
                        'danger' => 'text-danger-50 dark:text-danger-700',
                        'gray', null => 'text-gray-50 dark:text-gray-700',
                        'info' => 'text-info-50 dark:text-info-700',
                        'primary' => 'text-primary-50 dark:text-primary-700',
                        'secondary' => 'text-secondary-50 dark:text-secondary-700',
                        'success' => 'text-success-50 dark:text-success-700',
                        'warning' => 'text-warning-50 dark:text-warning-700',
                        default => $chartColor,
                    },
                ])
            ></span>

            <span
                x-ref="borderColorElement"
                @class([
                    match ($chartColor) {
                        'danger' => 'text-danger-400',
                        'gray', null => 'text-gray-400',
                        'info' => 'text-info-400',
                        'primary' => 'text-primary-400',
                        'secondary' => 'text-secondary-400',
                        'success' => 'text-success-400',
                        'warning' => 'text-warning-400',
                        default => $chartColor,
                    },
                ])
            ></span>
        </div>
    @endif
</{!! $tag !!}>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});