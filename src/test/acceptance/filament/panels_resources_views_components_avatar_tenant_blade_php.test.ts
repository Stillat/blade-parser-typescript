import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_components_avatar_tenant_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_components_avatar_tenant_blade_php', async () => {
        const input = `@props([
    'tenant' => filament()->getTenant(),
])

<x-filament::avatar
    :src="filament()->getTenantAvatarUrl($tenant)"
    {{ $attributes }}
/>
`;
        const output = `@props([
    'tenant' => filament()->getTenant(),
])

<x-filament::avatar
    :src="filament()->getTenantAvatarUrl($tenant)"
    {{ $attributes }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});