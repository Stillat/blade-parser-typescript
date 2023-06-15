import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_components_database_trigger_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_database_trigger_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});