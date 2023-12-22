import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_toggleable_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_toggleable_index_blade_php', async () => {
        const input = `@props([
    'form',
    'maxHeight' => null,
    'width' => null,
])

<x-tables::dropdown
    {{ $attributes->class(['filament-tables-column-toggling']) }}
    :max-height="$maxHeight"
    placement="bottom-end"
    shift
    :width="$width"
    wire:key="{{ $this->id }}.table.toggle"
>
    <x-slot name="trigger">
        <x-tables::toggleable.trigger />
    </x-slot>

    <div class="p-4">
        {{ $form }}
    </div>
</x-tables::dropdown>
`;
        const output = `@props([
    'form',
    'maxHeight' => null,
    'width' => null,
])

<x-tables::dropdown
    {{ $attributes->class(['filament-tables-column-toggling']) }}
    :max-height="$maxHeight"
    placement="bottom-end"
    shift
    :width="$width"
    wire:key="{{ $this->id }}.table.toggle"
>
    <x-slot name="trigger">
        <x-tables::toggleable.trigger />
    </x-slot>

    <div class="p-4">
        {{ $form }}
    </div>
</x-tables::dropdown>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});