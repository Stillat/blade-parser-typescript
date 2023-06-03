import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_actions_cell_blade_php', () => {
    test('pint: it can format tables_resources_views_components_actions_cell_blade_php', () => {
        const input = `@props([
    'record',
])

<td
    wire:loading.remove.delay
    {{
        $attributes
            ->merge([
                'wire:target' => implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS),
            ], escape: false)
            ->class(['filament-tables-actions-cell px-4 py-3 whitespace-nowrap'])
    }}
>
    {{ $slot }}
</td>
`;
        const output = `@props([
    'record',
])

<td
    wire:loading.remove.delay
    {{
        $attributes
            ->merge([
                'wire:target' => implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS),
            ], escape: false)
            ->class(['filament-tables-actions-cell whitespace-nowrap px-4 py-3'])
    }}
>
    {{ $slot }}
</td>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});