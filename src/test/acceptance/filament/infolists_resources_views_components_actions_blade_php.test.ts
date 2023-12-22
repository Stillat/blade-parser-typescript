import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_actions_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_actions_blade_php', async () => {
        const input = `<div {{
    $attributes
        ->merge([
            'id' => $getId(),
        ], escape: false)
        ->merge($getExtraAttributes(), escape: false)
        ->class([
            'filament-infolists-actions-component flex flex-col h-full',
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
                'filament-infolists-actions-component flex h-full flex-col',
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

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});