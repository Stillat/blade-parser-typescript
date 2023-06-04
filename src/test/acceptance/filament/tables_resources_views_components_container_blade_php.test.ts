import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_container_blade_php', () => {
    test('pint: it can format tables_resources_views_components_container_blade_php', () => {
        const input = `<div {{ $attributes->class(['filament-tables-container rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20']) }}>
    {{ $slot }}
</div>
`;
        const output = `<div
    {{ $attributes->class(['filament-tables-container rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20']) }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});