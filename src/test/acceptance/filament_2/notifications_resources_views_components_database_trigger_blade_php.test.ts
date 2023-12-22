import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_database_trigger_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_database_trigger_blade_php', async () => {
        const input = `<div
    x-data="{}"
    x-on:click="$dispatch('open-modal', { id: 'database-notifications' })"
    {{ $attributes->class(['inline-block']) }}
>
    {{ $slot }}
</div>
`;
        const output = `<div
    x-data="{}"
    x-on:click="$dispatch('open-modal', { id: 'database-notifications' })"
    {{ $attributes->class(['inline-block']) }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});