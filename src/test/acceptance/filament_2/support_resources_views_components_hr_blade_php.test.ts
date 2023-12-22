import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_hr_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_hr_blade_php', async () => {
        const input = `@props([
    'darkMode' => false,
])

<div aria-hidden="true" {{ $attributes->class([
    'filament-hr border-t',
    'dark:border-gray-700' => $darkMode,
]) }}></div>
`;
        const output = `@props([
    'darkMode' => false,
])

<div
    aria-hidden="true"
    {{
        $attributes->class([
            'filament-hr border-t',
            'dark:border-gray-700' => $darkMode,
        ])
    }}
></div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});