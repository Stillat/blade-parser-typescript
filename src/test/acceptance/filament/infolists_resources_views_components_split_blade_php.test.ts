import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: infolists_resources_views_components_split_blade_php', () => {
    test('pint: it can format infolists_resources_views_components_split_blade_php', () => {
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
                    'sm' => 'flex-col sm:items-center sm:flex-row',
                    'md' => 'flex-col md:items-center md:flex-row',
                    'lg' => 'flex-col lg:items-center lg:flex-row',
                    'xl' => 'flex-col xl:items-center xl:flex-row',
                    '2xl' => 'flex-col 2xl:items-center 2xl:flex-row',
                    default => 'items-center',
                },
            ])
    }}
>
    @foreach ($getChildComponentContainers() as $container)
        @foreach ($container->getComponents() as $component)
            <div
                @class([
                    'flex-1 w-full' => $component->canGrow(),
                ])
            >
                {{ $component }}
            </div>
        @endforeach
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});