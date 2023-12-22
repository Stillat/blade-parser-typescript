import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_notification_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_notification_blade_php', async () => {
        const input = `@props([
    'notification',
])

<div
    x-data="notificationComponent({ notification: @js($notification) })"
    {{
        $attributes
            ->merge([
                'dusk' => 'filament.notifications.notification',
                'wire:key' => "{$this->id}.notifications.{$notification->getId()}",
            ], escape: false)
            ->class(['filament-notifications-notification pointer-events-auto invisible'])
    }}
>
    {{ $slot }}
</div>
`;
        const output = `@props([
    'notification',
])

<div
    x-data="notificationComponent({ notification: @js($notification) })"
    {{
        $attributes
            ->merge([
                'dusk' => 'filament.notifications.notification',
                'wire:key' => "{$this->id}.notifications.{$notification->getId()}",
            ], escape: false)
            ->class(['filament-notifications-notification pointer-events-auto invisible'])
    }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});