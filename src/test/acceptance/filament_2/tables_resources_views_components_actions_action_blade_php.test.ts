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
    if ((! $action->getAction()) || $action->getUrl()) {
        $wireClickAction = null;
    } elseif ($record = $action->getRecord()) {
        $wireClickAction = "mountTableAction('{$action->getName()}', '{$this->getTableRecordKey($record)}')";
    } else {
        $wireClickAction = "mountTableAction('{$action->getName()}')";
    }
@endphp

<x-dynamic-component
    :component="$component"
    :dark-mode="config('tables.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$wireClickAction"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :disabled="$action->isDisabled()"
    :color="$action->getColor()"
    :tooltip="$action->getTooltip()"
    :icon="$icon ?? $action->getIcon()"
    :size="$action->getSize() ?? 'sm'"
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
    if ((! $action->getAction()) || $action->getUrl()) {
        $wireClickAction = null;
    } elseif ($record = $action->getRecord()) {
        $wireClickAction = "mountTableAction('{$action->getName()}', '{$this->getTableRecordKey($record)}')";
    } else {
        $wireClickAction = "mountTableAction('{$action->getName()}')";
    }
@endphp

<x-dynamic-component
    :component="$component"
    :dark-mode="config('tables.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$wireClickAction"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :disabled="$action->isDisabled()"
    :color="$action->getColor()"
    :tooltip="$action->getTooltip()"
    :icon="$icon ?? $action->getIcon()"
    :size="$action->getSize() ?? 'sm'"
    dusk="filament.tables.action.{{ $action->getName() }}"
>
    {{ $slot }}
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});