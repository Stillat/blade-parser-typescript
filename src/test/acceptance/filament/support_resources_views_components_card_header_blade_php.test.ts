import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: support_resources_views_components_card_header_blade_php', () => {
    test('pint: it can format support_resources_views_components_card_header_blade_php', () => {
        const input = `<header {{ $attributes->class(['filament-card-header space-y-1']) }}>
    {{ $slot }}
</header>
`;
        const output = `<header {{ $attributes->class(['filament-card-header space-y-1']) }}>
    {{ $slot }}
</header>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});