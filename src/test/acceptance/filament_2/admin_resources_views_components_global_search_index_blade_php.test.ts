import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_global_search_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_global_search_index_blade_php', async () => {
        const input = `<div class="filament-global-search flex items-center ml-4 rtl:ml-0 rtl:mr-4">
    <x-filament::global-search.start />
    {{ \\Filament\\Facades\\Filament::renderHook('global-search.start') }}

    @if ($this->isEnabled())
        <div class="relative">
            <x-filament::global-search.input />

            @if ($results !== null)
                <x-filament::global-search.results-container :results="$results" />
            @endif
        </div>
    @endif

    <x-filament::global-search.end />
    {{ \\Filament\\Facades\\Filament::renderHook('global-search.end') }}
</div>
`;
        const output = `<div class="filament-global-search ml-4 flex items-center rtl:ml-0 rtl:mr-4">
    <x-filament::global-search.start />
    {{ \\Filament\\Facades\\Filament::renderHook('global-search.start') }}

    @if ($this->isEnabled())
        <div class="relative">
            <x-filament::global-search.input />

            @if ($results !== null)
                <x-filament::global-search.results-container
                    :results="$results"
                />
            @endif
        </div>
    @endif

    <x-filament::global-search.end />
    {{ \\Filament\\Facades\\Filament::renderHook('global-search.end') }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});