import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_pages_actions_modal_actions_button_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_pages_actions_modal_actions_button_action_blade_php', async () => {
        const input = `@php
    if (! $getAction()) {
        $wireClickAction = null;
    } else {
        $wireClickAction = $getAction();

        if ($getActionArguments()) {
            $wireClickAction .= '(\\'';
            $wireClickAction .= \\Illuminate\\Support\\Str::of(json_encode($getActionArguments()))->replace('"', '\\\\"');
            $wireClickAction .= '\\')';
        }
    }
@endphp

<x-filament::button
    :form="$getForm()"
    :type="$canSubmitForm() ? 'submit' : 'button'"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$wireClickAction"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :x-on:click="$canCancelAction() ? 'close()' : null"
    :color="$getColor()"
    :outlined="$isOutlined()"
    :icon="$getIcon()"
    :icon-position="$getIconPosition()"
    :size="$getSize()"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($getExtraAttributeBag())"
    class="filament-page-modal-button-action"
>
    {{ $getLabel() }}
</x-filament::button>
`;
        const output = `@php
    if (! $getAction()) {
        $wireClickAction = null;
    } else {
        $wireClickAction = $getAction();

        if ($getActionArguments()) {
            $wireClickAction .= '(\\'';
            $wireClickAction .= \\Illuminate\\Support\\Str::of(json_encode($getActionArguments()))->replace('"', '\\\\"');
            $wireClickAction .= '\\')';
        }
    }
@endphp

<x-filament::button
    :form="$getForm()"
    :type="$canSubmitForm() ? 'submit' : 'button'"
    :tag="$action->getUrl() ? 'a' : 'button'"
    :wire:click="$wireClickAction"
    :href="$action->isEnabled() ? $action->getUrl() : null"
    :target="$action->shouldOpenUrlInNewTab() ? '_blank' : null"
    :x-on:click="$canCancelAction() ? 'close()' : null"
    :color="$getColor()"
    :outlined="$isOutlined()"
    :icon="$getIcon()"
    :icon-position="$getIconPosition()"
    :size="$getSize()"
    :attributes="\\Filament\\Support\\prepare_inherited_attributes($getExtraAttributeBag())"
    class="filament-page-modal-button-action"
>
    {{ $getLabel() }}
</x-filament::button>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});