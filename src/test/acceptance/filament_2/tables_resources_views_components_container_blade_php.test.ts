import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_container_blade_php', () => {
    test('pint: it can format tables_resources_views_components_container_blade_php', () => {
        const input = `<div
    {{
        $attributes->class([
            'border border-gray-300 shadow-sm bg-white rounded-xl filament-tables-container',
            'dark:bg-gray-800 dark:border-gray-700' => config('tables.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</div>
`;
        const output = `<div
    {{
        $attributes->class([
            'border border-gray-300 shadow-sm bg-white rounded-xl filament-tables-container',
            'dark:bg-gray-800 dark:border-gray-700' => config('tables.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});