import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_database_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_database_index_blade_php', async () => {
        const input = `@php
    $notifications = $this->getDatabaseNotifications();
    $unreadNotificationsCount = $this->getUnreadDatabaseNotificationsCount();
@endphp

<div
    @if ($pollingInterval = $this->getPollingInterval())
        wire:poll.{{ $pollingInterval }}
    @endif
    class="flex items-center"
>
    @if ($databaseNotificationsTrigger = $this->getDatabaseNotificationsTrigger())
        <x-notifications::database.trigger>
            {{ $databaseNotificationsTrigger->with(['unreadNotificationsCount' => $unreadNotificationsCount]) }}
        </x-notifications::database.trigger>
    @endif

    <x-notifications::database.modal
        :notifications="$notifications"
        :unread-notifications-count="$unreadNotificationsCount"
    />
</div>
`;
        const output = `@php
    $notifications = $this->getDatabaseNotifications();
    $unreadNotificationsCount = $this->getUnreadDatabaseNotificationsCount();
@endphp

<div
    @if ($pollingInterval = $this->getPollingInterval())
        wire:poll.{{ $pollingInterval }}
    @endif
    class="flex items-center"
>
    @if ($databaseNotificationsTrigger = $this->getDatabaseNotificationsTrigger())
        <x-notifications::database.trigger>
            {{ $databaseNotificationsTrigger->with(['unreadNotificationsCount' => $unreadNotificationsCount]) }}
        </x-notifications::database.trigger>
    @endif

    <x-notifications::database.modal
        :notifications="$notifications"
        :unread-notifications-count="$unreadNotificationsCount"
    />
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});