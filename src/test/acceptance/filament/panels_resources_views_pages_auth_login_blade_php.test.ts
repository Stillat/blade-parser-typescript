import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: panels_resources_views_pages_auth_login_blade_php', () => {
    test('pint: it can format panels_resources_views_pages_auth_login_blade_php', () => {
        const input = `<div>
    @if (filament()->hasRegistration())
        <x-slot name="subheading">
            {{ __('filament::pages/auth/login.buttons.register.before') }}

            {{ $this->registerAction }}
        </x-slot>
    @endif

    <form
        wire:submit.prevent="authenticate"
        class="grid gap-y-8"
    >
        {{ $this->form }}

        {{ $this->authenticateAction }}
    </form>
</div>
`;
        const output = `<div>
    @if (filament()->hasRegistration())
        <x-slot name="subheading">
            {{ __('filament::pages/auth/login.buttons.register.before') }}

            {{ $this->registerAction }}
        </x-slot>
    @endif

    <form wire:submit.prevent="authenticate" class="grid gap-y-8">
        {{ $this->form }}

        {{ $this->authenticateAction }}
    </form>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});