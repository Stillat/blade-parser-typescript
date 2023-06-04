import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_components_title_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_title_blade_php', () => {
        const input = `<div
    @class([
        'filament-notifications-title flex h-6 items-center text-sm font-medium text-gray-900',
        'dark:text-gray-100' => config('notifications.dark_mode'),
    ])
>
    {{ $slot }}
</div>
`;
        const output = `<div
    @class([
        'filament-notifications-title flex h-6 items-center text-sm font-medium text-gray-900',
        'dark:text-gray-100' => config('notifications.dark_mode'),
    ])
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});