import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_table_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_table_blade_php', async () => {
        const input = `@props([
    'footer' => null,
    'header' => null,
])

<table {{ $attributes->class([
    'filament-tables-table w-full text-start divide-y table-auto',
    'dark:divide-gray-700' => config('tables.dark_mode'),
]) }}>
    @if ($header)
        <thead>
            <tr class="bg-gray-500/5">
                {{ $header }}
            </tr>
        </thead>
    @endif

    <tbody
        wire:sortable
        wire:end.stop="reorderTable($event.target.sortable.toArray())"
        wire:sortable.options="{ animation: 100 }"
        @class([
            'divide-y whitespace-nowrap',
            'dark:divide-gray-700' => config('tables.dark_mode'),
        ])
    >
        {{ $slot }}
    </tbody>

    @if ($footer)
        <tfoot>
            <tr class="bg-gray-50">
                {{ $footer }}
            </tr>
        </tfoot>
    @endif
</table>
`;
        const output = `@props([
    'footer' => null,
    'header' => null,
])

<table
    {{
        $attributes->class([
            'filament-tables-table w-full table-auto divide-y text-start',
            'dark:divide-gray-700' => config('tables.dark_mode'),
        ])
    }}
>
    @if ($header)
        <thead>
            <tr class="bg-gray-500/5">
                {{ $header }}
            </tr>
        </thead>
    @endif

    <tbody
        wire:sortable
        wire:end.stop="reorderTable($event.target.sortable.toArray())"
        wire:sortable.options="{ animation: 100 }"
        @class([
            'divide-y whitespace-nowrap',
            'dark:divide-gray-700' => config('tables.dark_mode'),
        ])
    >
        {{ $slot }}
    </tbody>

    @if ($footer)
        <tfoot>
            <tr class="bg-gray-50">
                {{ $footer }}
            </tr>
        </tfoot>
    @endif
</table>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});