import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_table_blade_php', () => {
    test('pint: it can format tables_resources_views_components_table_blade_php', () => {
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
            'filament-tables-table w-full text-start divide-y table-auto',
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});