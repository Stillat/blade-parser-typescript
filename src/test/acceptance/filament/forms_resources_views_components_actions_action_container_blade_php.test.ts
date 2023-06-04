import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_actions_action_container_blade_php', () => {
    test('pint: it can format forms_resources_views_components_actions_action_container_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});