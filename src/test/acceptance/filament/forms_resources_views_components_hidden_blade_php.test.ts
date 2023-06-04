import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_hidden_blade_php', () => {
    test('pint: it can format forms_resources_views_components_hidden_blade_php', () => {
        const input = `@php
    $statePath = $getStatePath();
@endphp

<input
    {{
        $attributes
            ->merge([
                'dusk' => "filament.forms.{$statePath}",
                'id' => $getId(),
                'type' => 'hidden',
                $applyStateBindingModifiers('wire:model') => $statePath,
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-forms-hidden-component'])
    }}
/>
`;
        const output = `@php
    $statePath = $getStatePath();
@endphp

<input
    {{
        $attributes
            ->merge([
                'dusk' => "filament.forms.{$statePath}",
                'id' => $getId(),
                'type' => 'hidden',
                $applyStateBindingModifiers('wire:model') => $statePath,
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-forms-hidden-component'])
    }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});