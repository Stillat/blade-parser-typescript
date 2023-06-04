import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: panels_resources_views_pages_auth_password_reset_reset_password_blade_php', () => {
    test('pint: it can format panels_resources_views_pages_auth_password_reset_reset_password_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});