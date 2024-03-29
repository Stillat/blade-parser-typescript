import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_notification_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_notification_blade_php', async () => {
        const input = `@php
    $color = $getColor();
    $isInline = $isInline();
@endphp

<x-filament-notifications::notification
    :notification="$notification"
    :x-transition:enter-start="\\Illuminate\\Support\\Arr::toCssClasses([
        'opacity-0',
        ($this instanceof \\Filament\\Notifications\\Http\\Livewire\\Notifications)
            ? match (static::$horizontalAlignment) {
                'left' => '-translate-x-12',
                'right' => 'translate-x-12',
                'center' => match (static::$verticalAlignment) {
                    'top' => '-translate-y-12',
                    'bottom' => 'translate-y-12',
                    'center' => null,
                },
            }
            : null,
    ])"
    x-transition:leave-end="scale-95 opacity-0"
    @class([
        'w-full transition duration-300',
        ...match ($isInline) {
            true => [],
            false => [
                'max-w-sm rounded-xl bg-white shadow-lg ring-1 dark:bg-gray-800',
                match ($color) {
                    'danger' => 'ring-danger-500/50',
                    'gray' => 'ring-gray-500/50',
                    'info' => 'ring-info-500/50',
                    'primary' => 'ring-primary-500/50',
                    'secondary' => 'ring-secondary-500/50',
                    'success' => 'ring-success-500/50',
                    'warning' => 'ring-warning-500/50',
                    default => 'ring-gray-950/5 dark:ring-white/20',
                },
            ],
        },
    ])
>
    <div
        @class([
            'flex gap-3 w-full',
            ...match ($isInline) {
                true => ['py-2 ps-6 pe-2'],
                false => [
                    'p-4 rounded-xl',
                    match ($color) {
                        'danger' => 'bg-danger-500/10 dark:bg-danger-500/20',
                        'gray' => 'bg-gray-500/10 dark:bg-gray-500/20',
                        'info' => 'bg-info-500/10 dark:bg-info-500/20',
                        'primary' => 'bg-primary-500/10 dark:bg-primary-500/20',
                        'secondary' => 'bg-secondary-500/10 dark:bg-secondary-500/20',
                        'success' => 'bg-success-500/10 dark:bg-success-500/20',
                        'warning' => 'bg-warning-500/10 dark:bg-warning-500/20',
                        default => null,
                    },
                ],
            },
        ])
    >
        @if ($icon = $getIcon())
            <x-filament-notifications::icon
                :name="$icon"
                :color="$getIconColor()"
                :size="$getIconSize()"
            />
        @endif

        <div class="grid flex-1">
            @if ($title = $getTitle())
                <x-filament-notifications::title>
                    {{ str($title)->markdown()->sanitizeHtml()->toHtmlString() }}
                </x-filament-notifications::title>
            @endif

            @if ($date = $getDate())
                <x-filament-notifications::date>
                    {{ $date }}
                </x-filament-notifications::date>
            @endif

            @if ($body = $getBody())
                <x-filament-notifications::body>
                    {{ str($body)->markdown()->sanitizeHtml()->toHtmlString() }}
                </x-filament-notifications::body>
            @endif

            @if ($actions = $getActions())
                <x-filament-notifications::actions :actions="$actions" />
            @endif
        </div>

        <x-filament-notifications::close-button />
    </div>
</x-filament-notifications::notification>
`;
        const output = `@php
    $color = $getColor();
    $isInline = $isInline();
@endphp

<x-filament-notifications::notification
    :notification="$notification"
    :x-transition:enter-start="
        \\Illuminate\\Support\\Arr::toCssClasses([
            'opacity-0',
            ($this instanceof \\Filament\\Notifications\\Http\\Livewire\\Notifications)
                ? match (static::$horizontalAlignment) {
                    'left' => '-translate-x-12',
                    'right' => 'translate-x-12',
                    'center' => match (static::$verticalAlignment) {
                        'top' => '-translate-y-12',
                        'bottom' => 'translate-y-12',
                        'center' => null,
                    },
                }
                : null,
        ])
    "
    x-transition:leave-end="scale-95 opacity-0"
    @class([
        'w-full transition duration-300',
        ...match ($isInline) {
            true => [],
            false => [
                'max-w-sm rounded-xl bg-white shadow-lg ring-1 dark:bg-gray-800',
                match ($color) {
                    'danger' => 'ring-danger-500/50',
                    'gray' => 'ring-gray-500/50',
                    'info' => 'ring-info-500/50',
                    'primary' => 'ring-primary-500/50',
                    'secondary' => 'ring-secondary-500/50',
                    'success' => 'ring-success-500/50',
                    'warning' => 'ring-warning-500/50',
                    default => 'ring-gray-950/5 dark:ring-white/20',
                },
            ],
        },
    ])
>
    <div
        @class([
            'flex w-full gap-3',
            ...match ($isInline) {
                true => ['py-2 pe-2 ps-6'],
                false => [
                    'rounded-xl p-4',
                    match ($color) {
                        'danger' => 'bg-danger-500/10 dark:bg-danger-500/20',
                        'gray' => 'bg-gray-500/10 dark:bg-gray-500/20',
                        'info' => 'bg-info-500/10 dark:bg-info-500/20',
                        'primary' => 'bg-primary-500/10 dark:bg-primary-500/20',
                        'secondary' => 'bg-secondary-500/10 dark:bg-secondary-500/20',
                        'success' => 'bg-success-500/10 dark:bg-success-500/20',
                        'warning' => 'bg-warning-500/10 dark:bg-warning-500/20',
                        default => null,
                    },
                ],
            },
        ])
    >
        @if ($icon = $getIcon())
            <x-filament-notifications::icon
                :name="$icon"
                :color="$getIconColor()"
                :size="$getIconSize()"
            />
        @endif

        <div class="grid flex-1">
            @if ($title = $getTitle())
                <x-filament-notifications::title>
                    {{ str($title)->markdown()->sanitizeHtml()->toHtmlString() }}
                </x-filament-notifications::title>
            @endif

            @if ($date = $getDate())
                <x-filament-notifications::date>
                    {{ $date }}
                </x-filament-notifications::date>
            @endif

            @if ($body = $getBody())
                <x-filament-notifications::body>
                    {{ str($body)->markdown()->sanitizeHtml()->toHtmlString() }}
                </x-filament-notifications::body>
            @endif

            @if ($actions = $getActions())
                <x-filament-notifications::actions :actions="$actions" />
            @endif
        </div>

        <x-filament-notifications::close-button />
    </div>
</x-filament-notifications::notification>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});