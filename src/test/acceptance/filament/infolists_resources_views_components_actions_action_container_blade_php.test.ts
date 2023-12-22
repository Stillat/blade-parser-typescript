import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_actions_action_container_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_actions_action_container_blade_php', async () => {
        const input = `@foreach ($getActions() as $action)
    @if ($action->isVisible())
        {{ $action }}
    @endif
@endforeach
`;
        const output = `@foreach ($getActions() as $action)
    @if ($action->isVisible())
        {{ $action }}
    @endif
@endforeach
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});