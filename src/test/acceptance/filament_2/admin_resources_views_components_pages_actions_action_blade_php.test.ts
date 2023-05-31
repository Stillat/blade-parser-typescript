import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: admin_resources_views_components_pages_actions_action_blade_php', () => {
    test('pint: it can format admin_resources_views_components_pages_actions_action_blade_php', () => {
        const input = `@props([
    'action',
    'component',
    'icon' => null,
])

@php
    if ((! $action->getAction()) || $action->getUrl()) {
        $wireClickAction = null;
    } elseif ($action->shouldOpenModal() || ($action->getAction() instanceof \\Closure)) {
        $wireClickAction = "mountAction('{$action->getName()}')";
    } else {
        $wireClickAction = $action->getAction();
    }
@endphp

<x-dynamic-component
    :component="$component"
    :dark-mode="config('filament.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :form="$action->getForm()"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$wireClickAction"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :type="$action->canSubmitForm() ? 'submit' : 'button'"
    :color="$action->getColor()"
    :key-bindings="$action->getKeybindings()"
    :tooltip="$action->getTooltip()"
    :disabled="$action->isDisabled()"
    :icon="$icon ?? $action->getIcon()"
    :size="$action->getSize()"
    :label-sr-only="$action->isLabelHidden()"
    dusk="filament.admin.action.{{ $action->getName() }}"
>
    {{ $slot }}
</x-dynamic-component>
`;
        const output = `@props([
    'action',
    'component',
    'icon' => null,
])

@php
    if ((! $action->getAction()) || $action->getUrl()) {
        $wireClickAction = null;
    } elseif ($action->shouldOpenModal() || ($action->getAction() instanceof \\Closure)) {
        $wireClickAction = "mountAction('{$action->getName()}')";
    } else {
        $wireClickAction = $action->getAction();
    }
@endphp

<x-dynamic-component
    :component="$component"
    :dark-mode="config('filament.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :form="$action->getForm()"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$wireClickAction"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :type="$action->canSubmitForm() ? 'submit' : 'button'"
    :color="$action->getColor()"
    :key-bindings="$action->getKeybindings()"
    :tooltip="$action->getTooltip()"
    :disabled="$action->isDisabled()"
    :icon="$icon ?? $action->getIcon()"
    :size="$action->getSize()"
    :label-sr-only="$action->isLabelHidden()"
    dusk="filament.admin.action.{{ $action->getName() }}"
>
    {{ $slot }}
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});