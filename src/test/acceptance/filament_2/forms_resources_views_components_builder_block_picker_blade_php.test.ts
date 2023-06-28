import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_builder_block_picker_blade_php', () => {
    test('pint: it can format forms_resources_views_components_builder_block_picker_blade_php', () => {
        const input = `@props([
    'blocks',
    'createAfterItem' => null,
    'statePath',
    'trigger',
])

<x-forms::dropdown {{ $attributes->class(['filament-forms-builder-component-block-picker']) }}>
    <x-slot name="trigger">
        {{ $trigger }}
    </x-slot>

    <x-forms::dropdown.list>
        @foreach ($blocks as $block)
            <x-forms::dropdown.list.item
                :wire:click="'dispatchFormEvent(\\'builder::createItem\\', \\'' . $statePath . '\\', \\'' . $block->getName() . '\\'' . ($createAfterItem ? ', \\'' . $createAfterItem . '\\'' : '') . ')'"
                :icon="$block->getIcon()"
                x-on:click="close"
            >
                {{ $block->getLabel() }}
            </x-forms::dropdown.list.item>
        @endforeach
    </x-forms::dropdown.list>
</x-forms::dropdown>
`;
        const output = `@props([
    'blocks',
    'createAfterItem' => null,
    'statePath',
    'trigger',
])

<x-forms::dropdown
    {{ $attributes->class(['filament-forms-builder-component-block-picker']) }}
>
    <x-slot name="trigger">
        {{ $trigger }}
    </x-slot>

    <x-forms::dropdown.list>
        @foreach ($blocks as $block)
            <x-forms::dropdown.list.item
                :wire:click="'dispatchFormEvent(\\'builder::createItem\\', \\''.$statePath.'\\', \\''.$block->getName().'\\''.($createAfterItem ? ', \\''.$createAfterItem.'\\'' : '').')'"
                :icon="$block->getIcon()"
                x-on:click="close"
            >
                {{ $block->getLabel() }}
            </x-forms::dropdown.list.item>
        @endforeach
    </x-forms::dropdown.list>
</x-forms::dropdown>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});