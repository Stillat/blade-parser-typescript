import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_empty_state_heading_blade_php', () => {
    test('pint: it can format tables_resources_views_components_empty_state_heading_blade_php', () => {
        const input = `<h2 {{ $attributes->class(['filament-tables-empty-state-heading text-xl font-medium tracking-tight dark:text-white']) }}>
    {{ $slot }}
</h2>
`;
        const output = `<h2
    {{ $attributes->class(['filament-tables-empty-state-heading text-xl font-medium tracking-tight dark:text-white']) }}
>
    {{ $slot }}
</h2>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});