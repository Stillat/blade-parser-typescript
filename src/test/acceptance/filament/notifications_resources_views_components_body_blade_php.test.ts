import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: notifications_resources_views_components_body_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_body_blade_php', () => {
        const input = `<div {{ $attributes->class(['filament-notifications-body mt-1 text-sm text-gray-500 dark:text-gray-300']) }}>
    {{ $slot }}
</div>
`;
        const output = `<div
    {{ $attributes->class(['filament-notifications-body mt-1 text-sm text-gray-500 dark:text-gray-300']) }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});