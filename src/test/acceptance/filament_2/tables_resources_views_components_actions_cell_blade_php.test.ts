import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_actions_cell_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_actions_cell_blade_php', async () => {
        const input = `@props([
    'record',
])

<td
    wire:loading.remove.delay
    wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
    {{ $attributes->class(['filament-tables-actions-cell px-4 py-3 whitespace-nowrap']) }}
>
    {{ $slot }}
</td>
`;
        const output = `@props([
    'record',
])

<td
    wire:loading.remove.delay
    wire:target="{{ implode(',', \\Filament\\Tables\\Table::LOADING_TARGETS) }}"
    {{ $attributes->class(['filament-tables-actions-cell whitespace-nowrap px-4 py-3']) }}
>
    {{ $slot }}
</td>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});