import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: support_resources_views_components_hr_blade_php', () => {
    test('pint: it can format support_resources_views_components_hr_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});