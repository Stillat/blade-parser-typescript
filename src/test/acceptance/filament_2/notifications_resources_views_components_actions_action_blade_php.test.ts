import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: notifications_resources_views_components_actions_action_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_actions_action_blade_php', () => {
        const input = `@props([
    'action',
    'component',
])

<x-dynamic-component
    :component="$component"
    :dark-mode="config('notifications.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$action->isEnabled() ? $action->getLivewireMountAction() : null"
    :x-on:click="$action->isEnabled() && $action->shouldCloseNotification() ? 'close' : null"
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

<x-dynamic-component
    :component="$component"
    :dark-mode="config('notifications.dark_mode')"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes)->merge($action->getExtraAttributes())"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$action->isEnabled() ? $action->getLivewireMountAction() : null"
    :x-on:click="$action->isEnabled() && $action->shouldCloseNotification() ? 'close' : null"
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});