import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: admin_resources_views_components_tabs_index_blade_php', () => {
    test('pint: it can format admin_resources_views_components_tabs_index_blade_php', () => {
        const input = `<nav
    {{
        $attributes->class([
            'filament-tabs flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 bg-gray-500/5 rounded-xl',
            'dark:bg-gray-500/20' => config('filament.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</nav>
`;
        const output = `<nav
    {{
        $attributes->class([
            'filament-tabs flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 bg-gray-500/5 rounded-xl',
            'dark:bg-gray-500/20' => config('filament.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</nav>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});