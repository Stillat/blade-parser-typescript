import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_pages_auth_password_reset_reset_password_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_pages_auth_password_reset_reset_password_blade_php', async () => {
        const input = `<form
    wire:submit.prevent="resetPassword"
    class="grid gap-y-8"
>
    {{ $this->form }}

    {{ $this->resetPasswordAction }}
</form>
`;
        const output = `<form wire:submit.prevent="resetPassword" class="grid gap-y-8">
    {{ $this->form }}

    {{ $this->resetPasswordAction }}
</form>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});