import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_resources_relation_manager_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_resources_relation_manager_blade_php', async () => {
        const input = `<div class="filament-resource-relation-manager">
    {{ filament()->renderHook('resource.relation-manager.start') }}

    {{ $this->table }}

    {{ filament()->renderHook('resource.relation-manager.end') }}
</div>
`;
        const output = `<div class="filament-resource-relation-manager">
    {{ filament()->renderHook('resource.relation-manager.start') }}

    {{ $this->table }}

    {{ filament()->renderHook('resource.relation-manager.end') }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});