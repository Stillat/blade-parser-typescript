import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_actions_blade_php', () => {
    test('pint: it can format forms_resources_views_components_actions_blade_php', () => {
        const input = `<div {{
    $attributes
        ->merge([
            'id' => $getId(),
        ], escape: false)
        ->merge($getExtraAttributes(), escape: false)
        ->class([
            'filament-forms-actions-component flex flex-col h-full',
            match ($verticalAlignment = $getVerticalAlignment()) {
                'center' => 'justify-center',
                'end' => 'justify-end',
                'start' => 'justify-start',
                default => $verticalAlignment,
            },
        ])
}}>
    <x-filament-actions::actions
        :actions="$getChildComponentContainer()->getComponents()"
        :alignment="$getAlignment()"
        :full-width="$isFullWidth()"
    />
</div>
`;
        const output = `<div
    {{
        $attributes
            ->merge([
                'id' => $getId(),
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class([
                'filament-forms-actions-component flex h-full flex-col',
                match ($verticalAlignment = $getVerticalAlignment()) {
                    'center' => 'justify-center',
                    'end' => 'justify-end',
                    'start' => 'justify-start',
                    default => $verticalAlignment,
                },
            ])
    }}
>
    <x-filament-actions::actions
        :actions="$getChildComponentContainer()->getComponents()"
        :alignment="$getAlignment()"
        :full-width="$isFullWidth()"
    />
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});