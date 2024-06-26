import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_user_avatar_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_user_avatar_blade_php', async () => {
        const input = `@props([
    'user' => \\Filament\\Facades\\Filament::auth()->user(),
])

<div
    {{ $attributes->class([
        'w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center',
        'dark:bg-gray-900' => config('filament.dark_mode'),
    ]) }}
    style="background-image: url('{{ \\Filament\\Facades\\Filament::getUserAvatarUrl($user) }}')"
></div>
`;
        const output = `@props([
    'user' => \\Filament\\Facades\\Filament::auth()->user(),
])

<div
    {{
        $attributes->class([
            'h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center',
            'dark:bg-gray-900' => config('filament.dark_mode'),
        ])
    }}
    style="
        background-image: url('{{ \\Filament\\Facades\\Filament::getUserAvatarUrl($user) }}');
    "
></div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});