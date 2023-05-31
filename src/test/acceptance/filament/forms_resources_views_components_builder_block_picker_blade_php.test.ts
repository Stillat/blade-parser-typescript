import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_builder_block_picker_blade_php', () => {
    test('pint: it can format forms_resources_views_components_builder_block_picker_blade_php', () => {
        const input = `@props([
    'action',
    'blocks',
    'afterItem' => null,
    'statePath',
    'trigger',
])

<x-filament::dropdown {{ $attributes->class(['filament-forms-builder-component-block-picker']) }}>
    <x-slot name="trigger">
        {{ $trigger }}
    </x-slot>

    <x-filament::dropdown.list>
        @foreach ($blocks as $block)
            @php
                $wireClickActionArguments = ['block' => $block->getName()];
                if ($afterItem) {
                    $wireClickActionArguments['afterItem'] = $afterItem;
                }
                $wireClickActionArguments = \\Illuminate\\Support\\Js::from($wireClickActionArguments);

                $wireClickAction = "mountFormComponentAction('{$statePath}', '{$action->getName()}', {$wireClickActionArguments})";
            @endphp

            <x-filament::dropdown.list.item
                :wire:click="$wireClickAction"
                :icon="$block->getIcon()"
                x-on:click="close"
            >
                {{ $block->getLabel() }}
            </x-filament::dropdown.list.item>
        @endforeach
    </x-filament::dropdown.list>
</x-filament::dropdown>
`;
        const output = `@props([
    'action',
    'blocks',
    'afterItem' => null,
    'statePath',
    'trigger',
])

<x-filament::dropdown
    {{ $attributes->class(['filament-forms-builder-component-block-picker']) }}
>
    <x-slot name="trigger">
        {{ $trigger }}
    </x-slot>

    <x-filament::dropdown.list>
        @foreach ($blocks as $block)
            @php
                $wireClickActionArguments = ['block' => $block->getName()];
                if ($afterItem) {
                    $wireClickActionArguments['afterItem'] = $afterItem;
                }
                $wireClickActionArguments = \\Illuminate\\Support\\Js::from($wireClickActionArguments);

                $wireClickAction = "mountFormComponentAction('{$statePath}', '{$action->getName()}', {$wireClickActionArguments})";
            @endphp

            <x-filament::dropdown.list.item
                :wire:click="$wireClickAction"
                :icon="$block->getIcon()"
                x-on:click="close"
            >
                {{ $block->getLabel() }}
            </x-filament::dropdown.list.item>
        @endforeach
    </x-filament::dropdown.list>
</x-filament::dropdown>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});