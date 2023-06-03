import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_toggleable_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_toggleable_index_blade_php', () => {
        const input = `@props([
    'form',
    'maxHeight' => null,
    'width' => null,
])

<x-filament::dropdown
    {{ $attributes->class(['filament-tables-column-toggling']) }}
    :max-height="$maxHeight"
    placement="bottom-start"
    shift
    :width="$width"
    wire:key="{{ $this->id }}.table.toggle"
>
    <x-slot name="trigger">
        <x-filament-tables::toggleable.trigger />
    </x-slot>

    <div class="p-4">
        {{ $form }}
    </div>
</x-filament::dropdown>
`;
        const output = `@props([
    'form',
    'maxHeight' => null,
    'width' => null,
])

<x-filament::dropdown
    {{ $attributes->class(['filament-tables-column-toggling']) }}
    :max-height="$maxHeight"
    placement="bottom-start"
    shift
    :width="$width"
    wire:key="{{ $this->id }}.table.toggle"
>
    <x-slot name="trigger">
        <x-filament-tables::toggleable.trigger />
    </x-slot>

    <div class="p-4">
        {{ $form }}
    </div>
</x-filament::dropdown>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});