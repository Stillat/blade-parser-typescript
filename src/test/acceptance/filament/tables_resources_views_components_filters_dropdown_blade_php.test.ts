import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_filters_dropdown_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_filters_dropdown_blade_php', async () => {
        const input = `@props([
    'form',
    'indicatorsCount' => null,
    'maxHeight' => null,
    'triggerAction',
    'width' => 'xs',
])

<x-filament::dropdown
    {{ $attributes->class(['filament-tables-filters']) }}
    :max-height="$maxHeight"
    placement="bottom-start"
    shift
    :width="$width"
    wire:key="{{ $this->id }}.table.filters"
>
    <x-slot name="trigger" class="flex items-center justify-center">
        {{ $triggerAction->indicator($indicatorsCount) }}
    </x-slot>

    <x-filament-tables::filters
        class="p-4"
        :form="$form"
    />
</x-filament::dropdown>
`;
        const output = `@props([
    'form',
    'indicatorsCount' => null,
    'maxHeight' => null,
    'triggerAction',
    'width' => 'xs',
])

<x-filament::dropdown
    {{ $attributes->class(['filament-tables-filters']) }}
    :max-height="$maxHeight"
    placement="bottom-start"
    shift
    :width="$width"
    wire:key="{{ $this->id }}.table.filters"
>
    <x-slot name="trigger" class="flex items-center justify-center">
        {{ $triggerAction->indicator($indicatorsCount) }}
    </x-slot>

    <x-filament-tables::filters class="p-4" :form="$form" />
</x-filament::dropdown>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});