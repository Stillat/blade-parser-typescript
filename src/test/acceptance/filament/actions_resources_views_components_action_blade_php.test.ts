import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: actions_resources_views_components_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format actions_resources_views_components_action_blade_php', async () => {
        const input = `@props([
    'action',
    'dynamicComponent',
    'icon' => null,
])

@php
    $isDisabled = $action->isDisabled();
    $url = $action->getUrl();
@endphp

<x-dynamic-component
    :component="$dynamicComponent"
    :form="$action->getFormToSubmit()"
    :tag="$url ? 'a' : 'button'"
    :x-on:click="$action->getAlpineClickHandler()"
    :wire:click="$action->getLivewireClickHandler()"
    :href="$isDisabled ? null : $url"
    :target="($url && $action->shouldOpenUrlInNewTab()) ? '_blank' : null"
    :type="$action->canSubmitForm() ? 'submit' : 'button'"
    :color="$action->getColor()"
    :key-bindings="$action->getKeyBindings()"
    :tooltip="$action->getTooltip()"
    :disabled="$isDisabled"
    :icon="$icon ?? $action->getIcon()"
    :indicator="$action->getIndicator()"
    :indicator-color="$action->getIndicatorColor()"
    :size="$action->getSize()"
    :label-sr-only="$action->isLabelHidden()"
    dusk="filament.actions.action.{{ $action->getName() }}"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes(), escape: false)"
>
    {{ $slot }}
</x-dynamic-component>
`;
        const output = `@props([
    'action',
    'dynamicComponent',
    'icon' => null,
])

@php
    $isDisabled = $action->isDisabled();
    $url = $action->getUrl();
@endphp

<x-dynamic-component
    :component="$dynamicComponent"
    :form="$action->getFormToSubmit()"
    :tag="$url ? 'a' : 'button'"
    :x-on:click="$action->getAlpineClickHandler()"
    :wire:click="$action->getLivewireClickHandler()"
    :href="$isDisabled ? null : $url"
    :target="($url && $action->shouldOpenUrlInNewTab()) ? '_blank' : null"
    :type="$action->canSubmitForm() ? 'submit' : 'button'"
    :color="$action->getColor()"
    :key-bindings="$action->getKeyBindings()"
    :tooltip="$action->getTooltip()"
    :disabled="$isDisabled"
    :icon="$icon ?? $action->getIcon()"
    :indicator="$action->getIndicator()"
    :indicator-color="$action->getIndicatorColor()"
    :size="$action->getSize()"
    :label-sr-only="$action->isLabelHidden()"
    dusk="filament.actions.action.{{ $action->getName() }}"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes(), escape: false)"
>
    {{ $slot }}
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});