import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_hidden_blade_php', () => {
    test('pint: it can format forms_resources_views_components_hidden_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});