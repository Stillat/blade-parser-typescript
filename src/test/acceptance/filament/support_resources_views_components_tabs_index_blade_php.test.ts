import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: support_resources_views_components_tabs_index_blade_php', () => {
    test('pint: it can format support_resources_views_components_tabs_index_blade_php', () => {
        const input = `@props([
    'label' => null,
])

<nav {{ $attributes
    ->merge([
        'aria-label' => $label,
        'role' => 'tablist',
    ])
    ->class(['filament-tabs flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 bg-gray-600/5 rounded-lg dark:bg-gray-500/20'])
}}>
    {{ $slot }}
</nav>
`;
        const output = `@props([
    'label' => null,
])

<nav
    {{
        $attributes
            ->merge([
                'aria-label' => $label,
                'role' => 'tablist',
            ])
            ->class(['filament-tabs flex items-center space-x-1 overflow-x-auto rounded-lg bg-gray-600/5 p-1 text-sm text-gray-600 rtl:space-x-reverse dark:bg-gray-500/20'])
    }}
>
    {{ $slot }}
</nav>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});