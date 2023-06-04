import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: panels_resources_views_widgets_account_widget_blade_php', () => {
    test('pint: it can format panels_resources_views_widgets_account_widget_blade_php', () => {
        const input = `<x-filament-widgets::widget class="filament-account-widget">
    <x-filament::card>
        @php
            $user = filament()->auth()->user();
        @endphp

        <div class="h-12 flex items-center space-x-4 rtl:space-x-reverse">
            <x-filament::avatar.user :user="$user" />

            <div>
                <h2 class="text-xl font-medium tracking-tight">
                    {{ __('filament::widgets/account-widget.welcome', ['user' => filament()->getUserName($user)]) }}
                </h2>

                <form action="{{ filament()->getLogoutUrl() }}" method="post" class="text-sm">
                    @csrf

                    <button
                        type="submit"
                        class="text-gray-600 outline-none hover:text-primary-500 focus:underline dark:text-gray-300 dark:hover:text-primary-500"
                    >
                        {{ __('filament::widgets/account-widget.buttons.logout.label') }}
                    </button>
                </form>
            </div>
        </div>
    </x-filament::card>
</x-filament-widgets::widget>
`;
        const output = `<x-filament-widgets::widget class="filament-account-widget">
    <x-filament::card>
        @php
            $user = filament()->auth()->user();
        @endphp

        <div class="flex h-12 items-center space-x-4 rtl:space-x-reverse">
            <x-filament::avatar.user :user="$user" />

            <div>
                <h2 class="text-xl font-medium tracking-tight">
                    {{ __('filament::widgets/account-widget.welcome', ['user' => filament()->getUserName($user)]) }}
                </h2>

                <form
                    action="{{ filament()->getLogoutUrl() }}"
                    method="post"
                    class="text-sm"
                >
                    @csrf

                    <button
                        type="submit"
                        class="hover:text-primary-500 dark:hover:text-primary-500 text-gray-600 outline-none focus:underline dark:text-gray-300"
                    >
                        {{ __('filament::widgets/account-widget.buttons.logout.label') }}
                    </button>
                </form>
            </div>
        </div>
    </x-filament::card>
</x-filament-widgets::widget>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});