import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_body_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_body_blade_php', async () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});