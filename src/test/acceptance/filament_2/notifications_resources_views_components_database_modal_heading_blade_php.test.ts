import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_database_modal_heading_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_database_modal_heading_blade_php', async () => {
        const input = `@props([
    'unreadNotificationsCount',
])

<x-notifications::modal.heading class="relative">
    <span>
        {{ __('notifications::database.modal.heading') }}
    </span>

    @if ($unreadNotificationsCount)
        <span @class([
            'inline-flex absolute items-center justify-center top-0 ml-1 min-w-[1rem] h-4 rounded-full text-xs text-primary-700 bg-primary-500/10',
            'dark:text-primary-500' => config('tables.dark_mode'),
        ])>
            {{ $unreadNotificationsCount }}
        </span>
    @endif
</x-notifications::modal.heading>
`;
        const output = `@props([
    'unreadNotificationsCount',
])

<x-notifications::modal.heading class="relative">
    <span>
        {{ __('notifications::database.modal.heading') }}
    </span>

    @if ($unreadNotificationsCount)
        <span
            @class([
                'text-primary-700 bg-primary-500/10 absolute top-0 ml-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full text-xs',
                'dark:text-primary-500' => config('tables.dark_mode'),
            ])
        >
            {{ $unreadNotificationsCount }}
        </span>
    @endif
</x-notifications::modal.heading>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});