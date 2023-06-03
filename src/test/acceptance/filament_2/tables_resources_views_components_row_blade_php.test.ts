import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_row_blade_php', () => {
    test('pint: it can format tables_resources_views_components_row_blade_php', () => {
        const input = `@props([
    'recordAction' => null,
    'recordUrl' => null,
    'striped' => false,
])

<tr
    {{ $attributes->class([
        'filament-tables-row transition',
        'hover:bg-gray-50' => $recordUrl || $recordAction,
        'dark:hover:bg-gray-500/10' => ($recordUrl || $recordAction) && config('tables.dark_mode'),
        'even:bg-gray-100' => $striped,
        'dark:even:bg-gray-900' => $striped && config('tables.dark_mode'),
    ]) }}
>
    {{ $slot }}
</tr>
`;
        const output = `@props([
    'recordAction' => null,
    'recordUrl' => null,
    'striped' => false,
])

<tr
    {{
        $attributes->class([
            'filament-tables-row transition',
            'hover:bg-gray-50' => $recordUrl || $recordAction,
            'dark:hover:bg-gray-500/10' => ($recordUrl || $recordAction) && config('tables.dark_mode'),
            'even:bg-gray-100' => $striped,
            'dark:even:bg-gray-900' => $striped && config('tables.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</tr>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});