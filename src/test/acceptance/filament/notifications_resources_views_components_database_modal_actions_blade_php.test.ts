import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_database_modal_actions_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_database_modal_actions_blade_php', async () => {
        const input = `@props([
    'notifications',
    'unreadNotificationsCount',
])

<div {{ $attributes }}>
    @if ($notifications->count())
        <div class="mt-2 text-sm">
            @if ($unreadNotificationsCount)
                <x-filament::link
                    wire:click="markAllNotificationsAsRead"
                    color="gray"
                    tag="button"
                    tabindex="-1"
                    wire:target="markAllNotificationsAsRead"
                    wire:loading.attr="disabled"
                    class="disabled:opacity-70 disabled:pointer-events-none"
                >
                    {{ __('filament-notifications::database.modal.buttons.mark_all_as_read.label') }}
                </x-filament::link>

                <span>
                    &bull;
                </span>
            @endif

            <x-filament::link
                wire:click="clearNotifications"
                x-on:click="close()"
                color="gray"
                tag="button"
                tabindex="-1"
                wire:target="clearNotifications"
                wire:loading.attr="disabled"
                class="disabled:opacity-70 disabled:pointer-events-none"
            >
                {{ __('filament-notifications::database.modal.buttons.clear.label') }}
            </x-filament::link>
        </div>
    @endif
</div>
`;
        const output = `@props([
    'notifications',
    'unreadNotificationsCount',
])

<div {{ $attributes }}>
    @if ($notifications->count())
        <div class="mt-2 text-sm">
            @if ($unreadNotificationsCount)
                <x-filament::link
                    wire:click="markAllNotificationsAsRead"
                    color="gray"
                    tag="button"
                    tabindex="-1"
                    wire:target="markAllNotificationsAsRead"
                    wire:loading.attr="disabled"
                    class="disabled:pointer-events-none disabled:opacity-70"
                >
                    {{ __('filament-notifications::database.modal.buttons.mark_all_as_read.label') }}
                </x-filament::link>

                <span>&bull;</span>
            @endif

            <x-filament::link
                wire:click="clearNotifications"
                x-on:click="close()"
                color="gray"
                tag="button"
                tabindex="-1"
                wire:target="clearNotifications"
                wire:loading.attr="disabled"
                class="disabled:pointer-events-none disabled:opacity-70"
            >
                {{ __('filament-notifications::database.modal.buttons.clear.label') }}
            </x-filament::link>
        </div>
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});