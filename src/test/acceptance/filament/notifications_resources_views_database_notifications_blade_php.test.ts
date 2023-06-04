import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_database_notifications_blade_php', () => {
    test('pint: it can format notifications_resources_views_database_notifications_blade_php', () => {
        const input = `@php
    $notifications = $this->getNotifications();
    $unreadNotificationsCount = $this->getUnreadNotificationsCount();
@endphp

<div
    @if ($pollingInterval = $this->getPollingInterval())
        wire:poll.{{ $pollingInterval }}
    @endif
    class="flex items-center"
>
    @if ($trigger = $this->getTrigger())
        <x-filament-notifications::database.trigger>
            {{ $trigger->with(['unreadNotificationsCount' => $unreadNotificationsCount]) }}
        </x-filament-notifications::database.trigger>
    @endif

    <x-filament-notifications::database.modal
        :notifications="$notifications"
        :unread-notifications-count="$unreadNotificationsCount"
    />

    @if ($broadcastChannel = $this->getBroadcastChannel())
        <x-filament-notifications::database.echo :channel="$broadcastChannel" />
    @endif
</div>
`;
        const output = `@php
    $notifications = $this->getNotifications();
    $unreadNotificationsCount = $this->getUnreadNotificationsCount();
@endphp

<div
    @if ($pollingInterval = $this->getPollingInterval())
        wire:poll.{{ $pollingInterval }}
    @endif
    class="flex items-center"
>
    @if ($trigger = $this->getTrigger())
        <x-filament-notifications::database.trigger>
            {{ $trigger->with(['unreadNotificationsCount' => $unreadNotificationsCount]) }}
        </x-filament-notifications::database.trigger>
    @endif

    <x-filament-notifications::database.modal
        :notifications="$notifications"
        :unread-notifications-count="$unreadNotificationsCount"
    />

    @if ($broadcastChannel = $this->getBroadcastChannel())
        <x-filament-notifications::database.echo
            :channel="$broadcastChannel"
        />
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});