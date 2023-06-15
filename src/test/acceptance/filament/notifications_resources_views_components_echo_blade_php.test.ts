import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_components_echo_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_echo_blade_php', () => {
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
            window.Echo.private(@js($channel)).notification((notification) => {
                setTimeout(() => $wire.handleBroadcastNotification(notification), 500);
            });
        });

        if (window.Echo) {
            window.dispatchEvent(new CustomEvent('EchoLoaded'));
        }
    "
    {{ $attributes }}
></div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});