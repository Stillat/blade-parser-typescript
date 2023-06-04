import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: support_resources_views_components_card_heading_blade_php', () => {
    test('pint: it can format support_resources_views_components_card_heading_blade_php', () => {
        const input = `<h2 {{ $attributes->class(['filament-card-heading text-xl font-medium tracking-tight']) }}>
    {{ $slot }}
</h2>
`;
        const output = `<h2
    {{ $attributes->class(['filament-card-heading text-xl font-medium tracking-tight']) }}
>
    {{ $slot }}
</h2>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});