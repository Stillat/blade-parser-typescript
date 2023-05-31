import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: notifications_resources_views_components_date_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_date_blade_php', () => {
        const input = `<p {{ $attributes->class(['filament-notifications-date text-xs text-gray-500 dark:text-gray-300']) }}>
    {{ $slot }}
</p>
`;
        const output = `<p
    {{ $attributes->class(['filament-notifications-date text-xs text-gray-500 dark:text-gray-300']) }}
>
    {{ $slot }}
</p>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});