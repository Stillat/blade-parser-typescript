import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_hidden_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_hidden_blade_php', async () => {
        const input = `<input
    id="{{ $getId() }}"
    {!! $isRequired() ? 'required' : null !!}
    type="hidden"
    {{ $applyStateBindingModifiers('wire:model') }}="{{ $getStatePath() }}"
    {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-hidden-component']) }}
    dusk="filament.forms.{{ $getStatePath() }}"
/>
`;
        const output = `<input
    id="{{ $getId() }}"
    {!! $isRequired() ? 'required' : null !!}
    type="hidden"
    {{ $applyStateBindingModifiers('wire:model') }}="{{ $getStatePath() }}"
    {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-hidden-component']) }}
    dusk="filament.forms.{{ $getStatePath() }}"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});