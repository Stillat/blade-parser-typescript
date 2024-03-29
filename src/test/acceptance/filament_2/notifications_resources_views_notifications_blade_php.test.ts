import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_notifications_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_notifications_blade_php', async () => {
        const input = `<div>
    <div
        @class([
            'filament-notifications pointer-events-none fixed inset-4 z-50 mx-auto flex gap-3',
            match (config('notifications.layout.alignment.horizontal')) {
                'left' => 'items-start',
                'center' => 'items-center',
                'right' => 'items-end',
            },
            match (config('notifications.layout.alignment.vertical')) {
                'top' => 'flex-col-reverse justify-end',
                'bottom' => 'flex-col justify-end',
                'center' => 'flex-col justify-center'
            },
        ])
        role="status"
    >
        @foreach ($notifications as $notification)
            {{ $notification }}
        @endforeach
    </div>

    @if ($this->hasDatabaseNotifications())
        <x-notifications::database />
    @endif

    @if ($broadcastChannel = $this->getBroadcastChannel())
        <x-notifications::echo :channel="$broadcastChannel" />
    @endif
</div>
`;
        const output = `<div>
    <div
        @class([
            'filament-notifications pointer-events-none fixed inset-4 z-50 mx-auto flex gap-3',
            match (config('notifications.layout.alignment.horizontal')) {
                'left' => 'items-start',
                'center' => 'items-center',
                'right' => 'items-end',
            },
            match (config('notifications.layout.alignment.vertical')) {
                'top' => 'flex-col-reverse justify-end',
                'bottom' => 'flex-col justify-end',
                'center' => 'flex-col justify-center'
            },
        ])
        role="status"
    >
        @foreach ($notifications as $notification)
            {{ $notification }}
        @endforeach
    </div>

    @if ($this->hasDatabaseNotifications())
        <x-notifications::database />
    @endif

    @if ($broadcastChannel = $this->getBroadcastChannel())
        <x-notifications::echo :channel="$broadcastChannel" />
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});