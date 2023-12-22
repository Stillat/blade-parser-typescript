import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_global_search_actions_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_global_search_actions_action_blade_php', async () => {
        const input = `@props([
    'action',
    'component',
])

@php
    $wireClickAction = null;

    if ($action->getEvent()) {
        $emitArguments = collect([$action->getEvent()])
            ->merge($action->getEventData())
            ->map(fn (mixed $value) => \\Illuminate\\Support\\Js::from($value)->toHtml())
            ->implode(', ');

        $wireClickAction = "\\$emit($emitArguments)";
    }
@endphp

<x-dynamic-component
    :component="$component"
    :dark-mode="config('filament.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$action->isEnabled() ? $wireClickAction : null"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :disabled="$action->isDisabled()"
    :color="$action->getColor()"
    :icon="$icon ?? $action->getIcon()"
    :size="$action->getSize() ?? 'sm'"
>
    {{ $slot }}
</x-dynamic-component>
`;
        const output = `@props([
    'action',
    'component',
])

@php
    $wireClickAction = null;

    if ($action->getEvent()) {
        $emitArguments = collect([$action->getEvent()])
            ->merge($action->getEventData())
            ->map(fn (mixed $value) => \\Illuminate\\Support\\Js::from($value)->toHtml())
            ->implode(', ');

        $wireClickAction = "\\$emit($emitArguments)";
    }
@endphp

<x-dynamic-component
    :component="$component"
    :dark-mode="config('filament.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$action->isEnabled() ? $wireClickAction : null"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :disabled="$action->isDisabled()"
    :color="$action->getColor()"
    :icon="$icon ?? $action->getIcon()"
    :size="$action->getSize() ?? 'sm'"
>
    {{ $slot }}
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});