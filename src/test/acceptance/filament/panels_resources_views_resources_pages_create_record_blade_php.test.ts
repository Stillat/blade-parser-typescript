import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_resources_pages_create_record_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_resources_pages_create_record_blade_php', async () => {
        const input = `<x-filament::page @class([
    'filament-resources-create-record-page',
    'filament-resources-' . str_replace('/', '-', $this->getResource()::getSlug()),
])>
    <x-filament::form wire:submit.prevent="create">
        {{ $this->form }}

        <x-filament::form.actions
            :actions="$this->getCachedFormActions()"
            :full-width="$this->hasFullWidthFormActions()"
        />
    </x-filament::form>
</x-filament::page>
`;
        const output = `<x-filament::page
    @class([
        'filament-resources-create-record-page',
        'filament-resources-'.str_replace('/', '-', $this->getResource()::getSlug()),
    ])
>
    <x-filament::form wire:submit.prevent="create">
        {{ $this->form }}

        <x-filament::form.actions
            :actions="$this->getCachedFormActions()"
            :full-width="$this->hasFullWidthFormActions()"
        />
    </x-filament::form>
</x-filament::page>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});