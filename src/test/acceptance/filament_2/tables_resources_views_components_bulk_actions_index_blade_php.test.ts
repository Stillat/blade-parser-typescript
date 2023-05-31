import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_bulk_actions_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_bulk_actions_index_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});