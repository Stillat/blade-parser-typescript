import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_filters_popover_blade_php', () => {
    test('pint: it can format tables_resources_views_components_filters_popover_blade_php', () => {
        const input = `@props([
    'form',
    'maxHeight' => null,
    'width' => 'xs',
    'indicatorsCount' => null,
])

<x-tables::dropdown
    {{ $attributes->class(['filament-tables-filters']) }}
    :max-height="$maxHeight"
    placement="bottom-end"
    shift
    :width="$width"
    wire:key="{{ $this->id }}.table.filters"
>
    <x-slot name="trigger">
        <x-tables::filters.trigger :indicators-count="$indicatorsCount" />
    </x-slot>

    <x-tables::filters
        class="p-4"
        :form="$form"
    />
</x-tables::dropdown>
`;
        const output = `@props([
    'form',
    'maxHeight' => null,
    'width' => 'xs',
    'indicatorsCount' => null,
])

<x-tables::dropdown
    {{ $attributes->class(['filament-tables-filters']) }}
    :max-height="$maxHeight"
    placement="bottom-end"
    shift
    :width="$width"
    wire:key="{{ $this->id }}.table.filters"
>
    <x-slot name="trigger">
        <x-tables::filters.trigger :indicators-count="$indicatorsCount" />
    </x-slot>

    <x-tables::filters class="p-4" :form="$form" />
</x-tables::dropdown>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});