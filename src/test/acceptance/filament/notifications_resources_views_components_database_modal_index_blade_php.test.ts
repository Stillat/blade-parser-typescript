import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_components_database_modal_index_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_database_modal_index_blade_php', () => {
        const input = `@props([
    'notifications',
    'unreadNotificationsCount',
])

<x-filament::modal
    id="database-notifications"
    close-button
    slide-over
    width="md"
>
    @if ($notifications->count())
        <x-slot name="header">
            <x-filament-notifications::database.modal.heading
                :unread-notifications-count="$unreadNotificationsCount"
            />

            <x-filament-notifications::database.modal.actions
                :notifications="$notifications"
                :unread-notifications-count="$unreadNotificationsCount"
            />
        </x-slot>

        <div class="mt-[calc(-1rem-1px)] -mx-6 border-b divide-y dark:border-gray-700">
            @foreach ($notifications as $notification)
                <div @class([
                    'bg-primary-50 dark:bg-gray-700' => $notification->unread(),
                ])>
                    {{ $this->getNotification($notification)->inline() }}
                </div>
            @endforeach
        </div>

        @if ($notifications instanceof \\Illuminate\\Contracts\\Pagination\\Paginator && $notifications->hasPages())
            <x-slot name="footer">
                @php
                    $isRtl = __('filament::layout.direction') === 'rtl';
                    $previousArrowIcon = $isRtl ? 'heroicon-m-chevron-right' : 'heroicon-m-chevron-left';
                    $nextArrowIcon = $isRtl ? 'heroicon-m-chevron-left' : 'heroicon-m-chevron-right';
                @endphp

                <nav
                    role="navigation"
                    aria-label="{{ __('filament-notifications::database.modal.pagination.label') }}"
                    class="flex items-center justify-between"
                >
                    <div class="flex items-center">
                        @if (! $notifications->onFirstPage())
                            <x-filament::button
                                :wire:click="'previousPage(\\'' . $notifications->getPageName() . '\\')'"
                                :icon="$previousArrowIcon"
                                rel="prev"
                                size="sm"
                                color="gray"
                            >
                                {{ __('filament-notifications::database.modal.pagination.buttons.previous.label') }}
                            </x-filament::button>
                        @endif
                    </div>

                    <div class="flex items-center">
                        @if ($notifications->hasMorePages())
                            <x-filament::button
                                :wire:click="'nextPage(\\'' . $notifications->getPageName() . '\\')'"
                                :icon="$nextArrowIcon"
                                icon-position="after"
                                rel="next"
                                size="sm"
                                color="gray"
                            >
                                {{ __('filament-notifications::database.modal.pagination.buttons.next.label') }}
                            </x-filament::button>
                        @endif
                    </div>
                </nav>
            </x-slot>
        @endif
    @else
        <x-filament-notifications::database.modal.empty-state />
    @endif
</x-filament::modal>
`;
        const output = `@props([
    'notifications',
    'unreadNotificationsCount',
])

<x-filament::modal
    id="database-notifications"
    close-button
    slide-over
    width="md"
>
    @if ($notifications->count())
        <x-slot name="header">
            <x-filament-notifications::database.modal.heading
                :unread-notifications-count="$unreadNotificationsCount"
            />

            <x-filament-notifications::database.modal.actions
                :notifications="$notifications"
                :unread-notifications-count="$unreadNotificationsCount"
            />
        </x-slot>

        <div
            class="-mx-6 mt-[calc(-1rem-1px)] divide-y border-b dark:border-gray-700"
        >
            @foreach ($notifications as $notification)
                <div
                    @class([
                        'bg-primary-50 dark:bg-gray-700' => $notification->unread(),
                    ])
                >
                    {{ $this->getNotification($notification)->inline() }}
                </div>
            @endforeach
        </div>

        @if ($notifications instanceof \\Illuminate\\Contracts\\Pagination\\Paginator && $notifications->hasPages())
            <x-slot name="footer">
                @php
                    $isRtl = __('filament::layout.direction') === 'rtl';
                    $previousArrowIcon = $isRtl ? 'heroicon-m-chevron-right' : 'heroicon-m-chevron-left';
                    $nextArrowIcon = $isRtl ? 'heroicon-m-chevron-left' : 'heroicon-m-chevron-right';
                @endphp

                <nav
                    role="navigation"
                    aria-label="{{ __('filament-notifications::database.modal.pagination.label') }}"
                    class="flex items-center justify-between"
                >
                    <div class="flex items-center">
                        @if (! $notifications->onFirstPage())
                            <x-filament::button
                                :wire:click="'previousPage(\\''.$notifications->getPageName().'\\')'"
                                :icon="$previousArrowIcon"
                                rel="prev"
                                size="sm"
                                color="gray"
                            >
                                {{ __('filament-notifications::database.modal.pagination.buttons.previous.label') }}
                            </x-filament::button>
                        @endif
                    </div>

                    <div class="flex items-center">
                        @if ($notifications->hasMorePages())
                            <x-filament::button
                                :wire:click="'nextPage(\\''.$notifications->getPageName().'\\')'"
                                :icon="$nextArrowIcon"
                                icon-position="after"
                                rel="next"
                                size="sm"
                                color="gray"
                            >
                                {{ __('filament-notifications::database.modal.pagination.buttons.next.label') }}
                            </x-filament::button>
                        @endif
                    </div>
                </nav>
            </x-slot>
        @endif
    @else
        <x-filament-notifications::database.modal.empty-state />
    @endif
</x-filament::modal>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});