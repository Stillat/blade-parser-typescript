import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_echo_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_echo_blade_php', async () => {
        const input = `@props([
    'channel',
])

<div
    x-data="{}"
    x-init="
        window.addEventListener('EchoLoaded', () => {
            window.Echo.private(@js($channel))
                .notification((notification) => {
                    setTimeout(() => $wire.handleBroadcastNotification(notification), 500)
                })
                .listen('.database-notifications.sent', () => {
                    setTimeout(() => $wire.call('$refresh'), 500)
                })
        })

        if (window.Echo) {
            window.dispatchEvent(new CustomEvent('EchoLoaded'))
        }
    "
    {{ $attributes }}
></div>
`;
        const output = `@props([
    'channel',
])

<div
    x-data="{}"
    x-init="
        window.addEventListener('EchoLoaded', () => {
            window.Echo.private(@js($channel))
                .notification((notification) => {
                    setTimeout(
                        () => $wire.handleBroadcastNotification(notification),
                        500,
                    )
                })
                .listen('.database-notifications.sent', () => {
                    setTimeout(() => $wire.call('$refresh'), 500)
                })
        })

        if (window.Echo) {
            window.dispatchEvent(new CustomEvent('EchoLoaded'))
        }
    "
    {{ $attributes }}
></div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});