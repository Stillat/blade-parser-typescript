import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_split_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_split_blade_php', async () => {
        const input = `<div {{ $attributes
    ->merge($getExtraAttributes(), escape: false)
    ->class([
        'flex gap-6',
        match ($getFromBreakpoint()) {
            'sm' => 'flex-col sm:items-center sm:flex-row',
            'md' => 'flex-col md:items-center md:flex-row',
            'lg' => 'flex-col lg:items-center lg:flex-row',
            'xl' => 'flex-col xl:items-center xl:flex-row',
            '2xl' => 'flex-col 2xl:items-center 2xl:flex-row',
            default => 'items-center',
        },
    ])
}}>
    @foreach ($getChildComponentContainers() as $container)
        @foreach ($container->getComponents() as $component)
            <div @class([
                'flex-1 w-full' => $component->canGrow(),
            ])>
                {{ $component }}
            </div>
        @endforeach
    @endforeach
</div>
`;
        const output = `<div
    {{
        $attributes
            ->merge($getExtraAttributes(), escape: false)
            ->class([
                'flex gap-6',
                match ($getFromBreakpoint()) {
                    'sm' => 'flex-col sm:flex-row sm:items-center',
                    'md' => 'flex-col md:flex-row md:items-center',
                    'lg' => 'flex-col lg:flex-row lg:items-center',
                    'xl' => 'flex-col xl:flex-row xl:items-center',
                    '2xl' => 'flex-col 2xl:flex-row 2xl:items-center',
                    default => 'items-center',
                },
            ])
    }}
>
    @foreach ($getChildComponentContainers() as $container)
        @foreach ($container->getComponents() as $component)
            <div
                @class([
                    'w-full flex-1' => $component->canGrow(),
                ])
            >
                {{ $component }}
            </div>
        @endforeach
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});