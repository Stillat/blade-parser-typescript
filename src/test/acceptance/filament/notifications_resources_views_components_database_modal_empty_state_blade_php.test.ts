import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_components_database_modal_empty_state_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_database_modal_empty_state_blade_php', () => {
        const input = `<div {{ $attributes->class(['flex flex-col items-center justify-center mx-auto my-6 space-y-4 text-center bg-white dark:bg-gray-800']) }}>
    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 dark:bg-gray-700">
        <x-filament::icon
            name="heroicon-o-bell"
            alias="filament-notifications::database.modal.empty-state"
            color="text-primary-500"
            size="h-6 w-6"
        />
    </div>

    <div class="max-w-md space-y-1">
        <h2 class="text-lg font-medium tracking-tight dark:text-white">
            {{ __('filament-notifications::database.modal.empty.heading') }}
        </h2>

        <p class="whitespace-normal text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ __('filament-notifications::database.modal.empty.description') }}
        </p>
    </div>
</div>
`;
        const output = `<div
    {{ $attributes->class(['mx-auto my-6 flex flex-col items-center justify-center space-y-4 bg-white text-center dark:bg-gray-800']) }}
>
    <div
        class="bg-primary-50 flex h-12 w-12 items-center justify-center rounded-full dark:bg-gray-700"
    >
        <x-filament::icon
            name="heroicon-o-bell"
            alias="filament-notifications::database.modal.empty-state"
            color="text-primary-500"
            size="h-6 w-6"
        />
    </div>

    <div class="max-w-md space-y-1">
        <h2 class="text-lg font-medium tracking-tight dark:text-white">
            {{ __('filament-notifications::database.modal.empty.heading') }}
        </h2>

        <p
            class="whitespace-normal text-sm font-medium text-gray-500 dark:text-gray-400"
        >
            {{ __('filament-notifications::database.modal.empty.description') }}
        </p>
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});