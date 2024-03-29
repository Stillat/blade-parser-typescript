import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_actions_group_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_actions_group_blade_php', async () => {
        const input = `@props([
    'actions',
    'color' => null,
    'darkMode' => false,
    'icon' => 'heroicon-o-dots-vertical',
    'label' => __('filament-support::actions/group.trigger.label'),
    'size' => null,
    'tooltip' => null,
])

<x-filament-support::dropdown
    :dark-mode="$darkMode"
    placement="bottom-end"
    teleport
    {{ $attributes }}
>
    <x-slot name="trigger">
        <x-filament-support::icon-button
            :color="$color"
            :dark-mode="$darkMode"
            :icon="$icon"
            :size="$size"
            :tooltip="$tooltip"
        >
            <x-slot name="label">
                {{ $label }}
            </x-slot>
        </x-filament-support::icon-button>
    </x-slot>

    <x-filament-support::dropdown.list>
        @foreach ($actions as $action)
            @if (! $action->isHidden())
                {{ $action }}
            @endif
        @endforeach
    </x-filament-support::dropdown.list>
</x-filament-support::dropdown>
`;
        const output = `@props([
    'actions',
    'color' => null,
    'darkMode' => false,
    'icon' => 'heroicon-o-dots-vertical',
    'label' => __('filament-support::actions/group.trigger.label'),
    'size' => null,
    'tooltip' => null,
])

<x-filament-support::dropdown
    :dark-mode="$darkMode"
    placement="bottom-end"
    teleport
    {{ $attributes }}
>
    <x-slot name="trigger">
        <x-filament-support::icon-button
            :color="$color"
            :dark-mode="$darkMode"
            :icon="$icon"
            :size="$size"
            :tooltip="$tooltip"
        >
            <x-slot name="label">
                {{ $label }}
            </x-slot>
        </x-filament-support::icon-button>
    </x-slot>

    <x-filament-support::dropdown.list>
        @foreach ($actions as $action)
            @if (! $action->isHidden())
                {{ $action }}
            @endif
        @endforeach
    </x-filament-support::dropdown.list>
</x-filament-support::dropdown>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});