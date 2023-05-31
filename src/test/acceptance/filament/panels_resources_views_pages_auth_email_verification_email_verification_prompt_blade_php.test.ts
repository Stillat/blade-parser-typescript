import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: panels_resources_views_pages_auth_email_verification_email_verification_prompt_blade_php', () => {
    test('pint: it can format panels_resources_views_pages_auth_email_verification_email_verification_prompt_blade_php', () => {
        const input = `<div class="space-y-6">
    <p class="text-center text-sm text-gray-600 dark:text-gray-300">
        {{ __('filament::pages/auth/email-verification/email-verification-prompt.messages.notification_sent', [
            'email' => filament()->auth()->user()->getEmailForVerification(),
        ]) }}
    </p>

    <p class="text-center text-sm text-gray-600 dark:text-gray-300">
        {{ __('filament::pages/auth/email-verification/email-verification-prompt.messages.notification_not_received') }}

        {{ $this->resendNotificationAction }}
    </p>
</div>
`;
        const output = `<div class="space-y-6">
    <p class="text-center text-sm text-gray-600 dark:text-gray-300">
        {{
            __('filament::pages/auth/email-verification/email-verification-prompt.messages.notification_sent', [
                'email' => filament()->auth()->user()->getEmailForVerification(),
            ])
        }}
    </p>

    <p class="text-center text-sm text-gray-600 dark:text-gray-300">
        {{ __('filament::pages/auth/email-verification/email-verification-prompt.messages.notification_not_received') }}

        {{ $this->resendNotificationAction }}
    </p>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});