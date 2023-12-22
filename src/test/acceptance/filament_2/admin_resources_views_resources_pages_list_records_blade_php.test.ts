import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_resources_pages_list_records_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_resources_pages_list_records_blade_php', async () => {
        const input = `<x-filament::page
    :class="\\Illuminate\\Support\\Arr::toCssClasses([
        'filament-resources-list-records-page',
        'filament-resources-' . str_replace('/', '-', $this->getResource()::getSlug()),
    ])"
>
    {{ \\Filament\\Facades\\Filament::renderHook('resource.pages.list-records.table.start') }}

    {{ $this->table }}

    {{ \\Filament\\Facades\\Filament::renderHook('resource.pages.list-records.table.end') }}
</x-filament::page>
`;
        const output = `<x-filament::page
    :class="
        \\Illuminate\\Support\\Arr::toCssClasses([
            'filament-resources-list-records-page',
            'filament-resources-'.str_replace('/', '-', $this->getResource()::getSlug()),
        ])
    "
>
    {{ \\Filament\\Facades\\Filament::renderHook('resource.pages.list-records.table.start') }}

    {{ $this->table }}

    {{ \\Filament\\Facades\\Filament::renderHook('resource.pages.list-records.table.end') }}
</x-filament::page>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});