import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_resources_pages_edit_record_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_resources_pages_edit_record_blade_php', async () => {
        const input = `<x-filament::page
    @class([
        'filament-resources-edit-record-page',
        'filament-resources-' . str_replace('/', '-', $this->getResource()::getSlug()),
        'filament-resources-record-' . $record->getKey(),
    ])
>
    @capture($form)
        <x-filament::form wire:submit.prevent="save">
            {{ $this->form }}

            <x-filament::form.actions
                :actions="$this->getCachedFormActions()"
                :full-width="$this->hasFullWidthFormActions()"
            />
        </x-filament::form>
    @endcapture

    @php
        $relationManagers = $this->getRelationManagers();
    @endphp

    @if ((! $this->hasCombinedRelationManagerTabsWithContent()) || (! count($relationManagers)))
        {{ $form() }}
    @endif

    @if (count($relationManagers))
        @if (! $this->hasCombinedRelationManagerTabsWithContent())
            <x-filament::hr />
        @endif

        <x-filament::resources.relation-managers
            :active-manager="$activeRelationManager"
            :content-tab-label="$this->getContentTabLabel()"
            :managers="$relationManagers"
            :owner-record="$record"
            :page-class="static::class"
        >
            @if ($this->hasCombinedRelationManagerTabsWithContent())
                <x-slot name="content">
                    {{ $form() }}
                </x-slot>
            @endif
        </x-filament::resources.relation-managers>
    @endif
</x-filament::page>
`;
        const output = `<x-filament::page
    @class([
        'filament-resources-edit-record-page',
        'filament-resources-'.str_replace('/', '-', $this->getResource()::getSlug()),
        'filament-resources-record-'.$record->getKey(),
    ])
>
    @capture($form)
        <x-filament::form wire:submit.prevent="save">
            {{ $this->form }}

            <x-filament::form.actions
                :actions="$this->getCachedFormActions()"
                :full-width="$this->hasFullWidthFormActions()"
            />
        </x-filament::form>
    @endcapture

    @php
        $relationManagers = $this->getRelationManagers();
    @endphp

    @if ((! $this->hasCombinedRelationManagerTabsWithContent()) || (! count($relationManagers)))
        {{ $form() }}
    @endif

    @if (count($relationManagers))
        @if (! $this->hasCombinedRelationManagerTabsWithContent())
            <x-filament::hr />
        @endif

        <x-filament::resources.relation-managers
            :active-manager="$activeRelationManager"
            :content-tab-label="$this->getContentTabLabel()"
            :managers="$relationManagers"
            :owner-record="$record"
            :page-class="static::class"
        >
            @if ($this->hasCombinedRelationManagerTabsWithContent())
                <x-slot name="content">
                    {{ $form() }}
                </x-slot>
            @endif
        </x-filament::resources.relation-managers>
    @endif
</x-filament::page>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});