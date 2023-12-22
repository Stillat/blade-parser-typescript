import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_actions_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_actions_action_blade_php', async () => {
        const input = `@props([
    'action',
    'component',
    'icon' => null,
])

@php
    $isDisabled = $action->isDisabled();
    $url = $action->getUrl();
@endphp

<x-dynamic-component
    :component="$component"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes(), escape: false)"
    :tag="$url ? 'a' : 'button'"
    :wire:click="$action->getLivewireClickHandler()"
    :href="$isDisabled ? null : $url"
    :target="($url && $action->shouldOpenUrlInNewTab()) ? '_blank' : null"
    :disabled="$isDisabled"
    :color="$action->getColor()"
    :tooltip="$action->getTooltip()"
    :icon="$icon ?? $action->getIcon()"
    :size="$action->getSize()"
    dusk="filament.tables.action.{{ $action->getName() }}"
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
    $isDisabled = $action->isDisabled();
    $url = $action->getUrl();
@endphp

<x-dynamic-component
    :component="$component"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes(), escape: false)"
    :tag="$url ? 'a' : 'button'"
    :wire:click="$action->getLivewireClickHandler()"
    :href="$isDisabled ? null : $url"
    :target="($url && $action->shouldOpenUrlInNewTab()) ? '_blank' : null"
    :disabled="$isDisabled"
    :color="$action->getColor()"
    :tooltip="$action->getTooltip()"
    :icon="$icon ?? $action->getIcon()"
    :size="$action->getSize()"
    dusk="filament.tables.action.{{ $action->getName() }}"
>
    {{ $slot }}
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});