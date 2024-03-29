import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_header_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_header_index_blade_php', async () => {
        const input = `@props([
    'actions' => [],
    'description' => null,
    'heading',
])

<div {{ $attributes->class(['filament-tables-header px-4 py-2']) }}>
    <div class="flex flex-col gap-4 md:justify-between md:items-start md:flex-row md:-mr-2">
        <div>
            @if ($heading)
                <x-tables::header.heading>
                    {{ $heading }}
                </x-tables::header.heading>
            @endif

            @if ($description)
                <x-tables::header.description>
                    {{ $description }}
                </x-tables::header.description>
            @endif
        </div>

        <x-tables::actions
            :actions="$actions"
            alignment="right"
            wrap
            class="shrink-0"
        />
    </div>
</div>
`;
        const output = `@props([
    'actions' => [],
    'description' => null,
    'heading',
])

<div {{ $attributes->class(['filament-tables-header px-4 py-2']) }}>
    <div
        class="flex flex-col gap-4 md:-mr-2 md:flex-row md:items-start md:justify-between"
    >
        <div>
            @if ($heading)
                <x-tables::header.heading>
                    {{ $heading }}
                </x-tables::header.heading>
            @endif

            @if ($description)
                <x-tables::header.description>
                    {{ $description }}
                </x-tables::header.description>
            @endif
        </div>

        <x-tables::actions
            :actions="$actions"
            alignment="right"
            wrap
            class="shrink-0"
        />
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});