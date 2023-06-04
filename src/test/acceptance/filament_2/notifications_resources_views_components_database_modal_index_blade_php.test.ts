import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_components_database_modal_index_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_database_modal_index_blade_php', () => {
        const input = `@props([
    'notifications',
    'unreadNotificationsCount',
])

<x-notifications::modal
    id="database-notifications"
    close-button
    slide-over
    width="md"
>
    @if ($notifications->count())
        <x-slot name="header">
            <x-notifications::database.modal.heading
                :unread-notifications-count="$unreadNotificationsCount"
            />

            <x-notifications::database.modal.actions
                :notifications="$notifications"
                :unread-notifications-count="$unreadNotificationsCount"
            />
        </x-slot>

        <div class="mt-[calc(-1rem-1px)]">
            @foreach ($notifications as $notification)
                <div @class([
                    '-mx-6 border-b',
                    'border-t' => $notification->unread(),
                    'dark:border-gray-700' => (! $notification->unread()) && config('notifications.dark_mode'),
                    'dark:border-gray-800' => $notification->unread() && config('notifications.dark_mode'),
                ])>
                    <div @class([
                        'py-2 pl-4 pr-2',
                        'bg-primary-50 -mb-px' => $notification->unread(),
                        'dark:bg-gray-700' => $notification->unread() && config('notifications.dark_mode'),
                    ])>
                        {{ $this->getNotificationFromDatabaseRecord($notification)->inline() }}
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <x-notifications::database.modal.empty-state />
    @endif
</x-notifications::modal>
`;
        const output = `@props([
    'notifications',
    'unreadNotificationsCount',
])

<x-notifications::modal
    id="database-notifications"
    close-button
    slide-over
    width="md"
>
    @if ($notifications->count())
        <x-slot name="header">
            <x-notifications::database.modal.heading
                :unread-notifications-count="$unreadNotificationsCount"
            />

            <x-notifications::database.modal.actions
                :notifications="$notifications"
                :unread-notifications-count="$unreadNotificationsCount"
            />
        </x-slot>

        <div class="mt-[calc(-1rem-1px)]">
            @foreach ($notifications as $notification)
                <div
                    @class([
                        '-mx-6 border-b',
                        'border-t' => $notification->unread(),
                        'dark:border-gray-700' => (! $notification->unread()) && config('notifications.dark_mode'),
                        'dark:border-gray-800' => $notification->unread() && config('notifications.dark_mode'),
                    ])
                >
                    <div
                        @class([
                            'py-2 pl-4 pr-2',
                            'bg-primary-50 -mb-px' => $notification->unread(),
                            'dark:bg-gray-700' => $notification->unread() && config('notifications.dark_mode'),
                        ])
                    >
                        {{ $this->getNotificationFromDatabaseRecord($notification)->inline() }}
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <x-notifications::database.modal.empty-state />
    @endif
</x-notifications::modal>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});