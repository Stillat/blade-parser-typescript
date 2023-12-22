import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_widgets_account_widget_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_widgets_account_widget_blade_php', async () => {
        const input = `<x-filament::widget class="filament-account-widget">
    <x-filament::card>
        @php
            $user = \\Filament\\Facades\\Filament::auth()->user();
        @endphp

        <div class="h-12 flex items-center space-x-4 rtl:space-x-reverse">
            <x-filament::user-avatar :user="$user" />

            <div>
                <h2 class="text-lg sm:text-xl font-bold tracking-tight">
                    {{ __('filament::widgets/account-widget.welcome', ['user' => \\Filament\\Facades\\Filament::getUserName($user)]) }}
                </h2>

                <form action="{{ route('filament.auth.logout') }}" method="post" class="text-sm">
                    @csrf

                    <button
                        type="submit"
                        @class([
                            'text-gray-600 hover:text-primary-500 outline-none focus:underline',
                            'dark:text-gray-300 dark:hover:text-primary-500' => config('filament.dark_mode'),
                        ])
                    >
                        {{ __('filament::widgets/account-widget.buttons.logout.label') }}
                    </button>
                </form>
            </div>
        </div>
    </x-filament::card>
</x-filament::widget>
`;
        const output = `<x-filament::widget class="filament-account-widget">
    <x-filament::card>
        @php
            $user = \\Filament\\Facades\\Filament::auth()->user();
        @endphp

        <div class="flex h-12 items-center space-x-4 rtl:space-x-reverse">
            <x-filament::user-avatar :user="$user" />

            <div>
                <h2 class="text-lg font-bold tracking-tight sm:text-xl">
                    {{ __('filament::widgets/account-widget.welcome', ['user' => \\Filament\\Facades\\Filament::getUserName($user)]) }}
                </h2>

                <form
                    action="{{ route('filament.auth.logout') }}"
                    method="post"
                    class="text-sm"
                >
                    @csrf

                    <button
                        type="submit"
                        @class([
                            'hover:text-primary-500 text-gray-600 outline-none focus:underline',
                            'dark:hover:text-primary-500 dark:text-gray-300' => config('filament.dark_mode'),
                        ])
                    >
                        {{ __('filament::widgets/account-widget.buttons.logout.label') }}
                    </button>
                </form>
            </div>
        </div>
    </x-filament::card>
</x-filament::widget>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});