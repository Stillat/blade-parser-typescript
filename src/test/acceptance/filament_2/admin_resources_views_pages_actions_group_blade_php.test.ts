import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_pages_actions_group_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_pages_actions_group_blade_php', async () => {
        const input = `<x-filament-support::actions.group
    :actions="$getActions()"
    :dark-mode="config('filament.dark_mode')"
    :color="$getColor()"
    :icon="$getIcon()"
    :label="$getLabel()"
    :size="$getSize()"
    :tooltip="$getTooltip()"
/>
`;
        const output = `<x-filament-support::actions.group
    :actions="$getActions()"
    :dark-mode="config('filament.dark_mode')"
    :color="$getColor()"
    :icon="$getIcon()"
    :label="$getLabel()"
    :size="$getSize()"
    :tooltip="$getTooltip()"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});