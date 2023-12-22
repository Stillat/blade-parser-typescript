import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_actions_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_actions_blade_php', async () => {
        const input = `@props([
    'actions',
])

<div {{ $attributes->class(['filament-notifications-actions mt-2 flex gap-3']) }}>
    @foreach ($actions as $action)
        {{ $action }}
    @endforeach
</div>
`;
        const output = `@props([
    'actions',
])

<div
    {{ $attributes->class(['filament-notifications-actions mt-2 flex gap-3']) }}
>
    @foreach ($actions as $action)
        {{ $action }}
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});