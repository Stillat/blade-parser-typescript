import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_pages_auth_email_verification_email_verification_prompt_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_pages_auth_email_verification_email_verification_prompt_blade_php', async () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});