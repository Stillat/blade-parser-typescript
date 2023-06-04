import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: panels_resources_views_resources_relation_manager_blade_php', () => {
    test('pint: it can format panels_resources_views_resources_relation_manager_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});