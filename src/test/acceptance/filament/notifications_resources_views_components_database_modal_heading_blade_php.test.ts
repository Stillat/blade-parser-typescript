import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: notifications_resources_views_components_database_modal_heading_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_database_modal_heading_blade_php', () => {
        const input = `@props([
    'unreadNotificationsCount',
])

<x-filament::modal.heading class="relative">
    <span>
        {{ __('filament-notifications::database.modal.heading') }}
    </span>

    @if ($unreadNotificationsCount)
        <span class="inline-flex absolute items-center justify-center top-0 ms-1 min-w-[1rem] h-4 rounded-full text-xs text-primary-700 bg-primary-500/10 dark:text-primary-500">
            {{ $unreadNotificationsCount }}
        </span>
    @endif
</x-filament::modal.heading>
`;
        const output = `@props([
    'unreadNotificationsCount',
])

<x-filament::modal.heading class="relative">
    <span>
        {{ __('filament-notifications::database.modal.heading') }}
    </span>

    @if ($unreadNotificationsCount)
        <span
            class="text-primary-700 bg-primary-500/10 dark:text-primary-500 absolute top-0 ms-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full text-xs"
        >
            {{ $unreadNotificationsCount }}
        </span>
    @endif
</x-filament::modal.heading>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});