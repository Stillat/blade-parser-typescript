import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_bulk_actions_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_bulk_actions_index_blade_php', async () => {
        const input = `@props([
    'actions',
])

<x-tables::dropdown
    {{ $attributes->class(['filament-tables-bulk-actions']) }}
    placement="bottom-start"
>
    <x-slot name="trigger">
        <x-tables::bulk-actions.trigger />
    </x-slot>

    <x-tables::dropdown.list>
        @foreach ($actions as $action)
            {{ $action }}
        @endforeach
    </x-tables::dropdown.list>
</x-tables::dropdown>
`;
        const output = `@props([
    'actions',
])

<x-tables::dropdown
    {{ $attributes->class(['filament-tables-bulk-actions']) }}
    placement="bottom-start"
>
    <x-slot name="trigger">
        <x-tables::bulk-actions.trigger />
    </x-slot>

    <x-tables::dropdown.list>
        @foreach ($actions as $action)
            {{ $action }}
        @endforeach
    </x-tables::dropdown.list>
</x-tables::dropdown>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});