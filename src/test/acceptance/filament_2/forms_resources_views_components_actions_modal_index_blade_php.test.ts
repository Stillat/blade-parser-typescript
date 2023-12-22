import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_actions_modal_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_actions_modal_index_blade_php', async () => {
        const input = `@php
    $action = $this->getMountedFormComponentAction();
@endphp

<form wire:submit.prevent="callMountedFormComponentAction">
    <x-forms::modal
        :id="$this->id . '-form-component-action'"
        :wire:key="$action ? $this->id . '.' . $action->getComponent()->getStatePath() . '.actions.' . $action->getName() . '.modal' : null"
        :visible="filled($action)"
        :width="$action?->getModalWidth()"
        :slide-over="$action?->isModalSlideOver()"
        :close-by-clicking-away="$action?->isModalClosedByClickingAway()"
        display-classes="block"
        x-init="livewire = $wire.__instance"
        x-on:modal-closed.stop="if ('mountedFormComponentAction' in livewire?.serverMemo.data) livewire.set('mountedFormComponentAction', null)"
    >
        @if ($action)
            @if ($action->isModalCentered())
                @if ($heading = $action->getModalHeading())
                    <x-slot name="heading">
                        {{ $heading }}
                    </x-slot>
                @endif

                @if ($subheading = $action->getModalSubheading())
                    <x-slot name="subheading">
                        {{ $subheading }}
                    </x-slot>
                @endif
            @else
                <x-slot name="header">
                    @if ($heading = $action->getModalHeading())
                        <x-forms::modal.heading>
                            {{ $heading }}
                        </x-forms::modal.heading>
                    @endif

                    @if ($subheading = $action->getModalSubheading())
                        <x-forms::modal.subheading>
                            {{ $subheading }}
                        </x-forms::modal.subheading>
                    @endif
                </x-slot>
            @endif

            {{ $action->getModalContent() }}

            @if ($action->hasFormSchema())
                {{ $this->getMountedFormComponentActionForm() }}
            @endif

            {{ $action->getModalFooter() }}

            @if (count($action->getModalActions()))
                <x-slot name="footer">
                    <x-forms::modal.actions :full-width="$action->isModalCentered()">
                        @foreach ($action->getModalActions() as $modalAction)
                            {{ $modalAction }}
                        @endforeach
                    </x-forms::modal.actions>
                </x-slot>
            @endif
        @endif
    </x-forms::modal>
</form>
`;
        const output = `@php
    $action = $this->getMountedFormComponentAction();
@endphp

<form wire:submit.prevent="callMountedFormComponentAction">
    <x-forms::modal
        :id="$this->id.'-form-component-action'"
        :wire:key="$action ? $this->id.'.'.$action->getComponent()->getStatePath().'.actions.'.$action->getName().'.modal' : null"
        :visible="filled($action)"
        :width="$action?->getModalWidth()"
        :slide-over="$action?->isModalSlideOver()"
        :close-by-clicking-away="$action?->isModalClosedByClickingAway()"
        display-classes="block"
        x-init="livewire = $wire.__instance"
        x-on:modal-closed.stop="if ('mountedFormComponentAction' in livewire?.serverMemo.data) livewire.set('mountedFormComponentAction', null)"
    >
        @if ($action)
            @if ($action->isModalCentered())
                @if ($heading = $action->getModalHeading())
                    <x-slot name="heading">
                        {{ $heading }}
                    </x-slot>
                @endif

                @if ($subheading = $action->getModalSubheading())
                    <x-slot name="subheading">
                        {{ $subheading }}
                    </x-slot>
                @endif
            @else
                <x-slot name="header">
                    @if ($heading = $action->getModalHeading())
                        <x-forms::modal.heading>
                            {{ $heading }}
                        </x-forms::modal.heading>
                    @endif

                    @if ($subheading = $action->getModalSubheading())
                        <x-forms::modal.subheading>
                            {{ $subheading }}
                        </x-forms::modal.subheading>
                    @endif
                </x-slot>
            @endif

            {{ $action->getModalContent() }}

            @if ($action->hasFormSchema())
                {{ $this->getMountedFormComponentActionForm() }}
            @endif

            {{ $action->getModalFooter() }}

            @if (count($action->getModalActions()))
                <x-slot name="footer">
                    <x-forms::modal.actions
                        :full-width="$action->isModalCentered()"
                    >
                        @foreach ($action->getModalActions() as $modalAction)
                            {{ $modalAction }}
                        @endforeach
                    </x-forms::modal.actions>
                </x-slot>
            @endif
        @endif
    </x-forms::modal>
</form>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});