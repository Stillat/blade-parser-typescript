import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_hidden_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_hidden_blade_php', async () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});