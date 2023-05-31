import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: support_resources_views_components_card_subheading_blade_php', () => {
    test('pint: it can format support_resources_views_components_card_subheading_blade_php', () => {
        const input = `<h3 {{ $attributes->class(['filament-card-subheading text-sm text-gray-600 dark:text-gray-400']) }}>
    {{ $slot }}
</h3>
`;
        const output = `<h3
    {{ $attributes->class(['filament-card-subheading text-sm text-gray-600 dark:text-gray-400']) }}
>
    {{ $slot }}
</h3>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});