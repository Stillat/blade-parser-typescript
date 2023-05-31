import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_header_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_header_index_blade_php', () => {
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

        <x-tables::actions :actions="$actions" alignment="right" wrap class="shrink-0" />
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
        class="flex flex-col gap-4 md:justify-between md:items-start md:flex-row md:-mr-2"
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});