import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_components_avatar_user_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_components_avatar_user_blade_php', async () => {
        const input = `@props([
    'user' => filament()->auth()->user(),
])

<x-filament::avatar
    :src="filament()->getUserAvatarUrl($user)"
    {{ $attributes }}
/>
`;
        const output = `@props([
    'user' => filament()->auth()->user(),
])

<x-filament::avatar
    :src="filament()->getUserAvatarUrl($user)"
    {{ $attributes }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});