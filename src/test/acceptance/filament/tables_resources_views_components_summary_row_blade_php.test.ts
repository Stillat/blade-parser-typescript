import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_summary_row_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_summary_row_blade_php', async () => {
        const input = `@props([
    'actions' => false,
    'actionsPosition' => null,
    'columns',
    'extraHeadingColumn' => false,
    'groupsOnly' => false,
    'heading',
    'placeholderColumns' => true,
    'query',
    'selectionEnabled' => false,
    'selectedState',
    'strong' => false,
    'recordCheckboxPosition' => null,
])

@php
    use Filament\\Tables\\Actions\\Position as ActionsPosition;
    use Filament\\Tables\\Actions\\RecordCheckboxPosition;
@endphp

<x-filament-tables::row {{ $attributes->class([
    'filament-tables-summary-row',
    'bg-gray-500/5' => $strong,
]) }}>
    @if ($placeholderColumns && $actions && in_array($actionsPosition, [ActionsPosition::BeforeCells, ActionsPosition::BeforeColumns]))
        <td></td>
    @endif

    @if ($placeholderColumns && $selectionEnabled && $recordCheckboxPosition === RecordCheckboxPosition::BeforeCells)
        <td></td>
    @endif

    @if ($extraHeadingColumn || $groupsOnly)
        <td class="align-top px-4 py-3 font-medium text-sm">
            {{ $heading }}
        </td>
    @else
        @php
            $headingColumnSpan = 1;

            foreach ($columns as $index => $column) {
                if ($index === array_key_first($columns)) {
                    continue;
                }

                if ($column->hasSummary()) {
                    break;
                }

                $headingColumnSpan++;
            }
        @endphp
    @endif

    @foreach ($columns as $column)
        @if (($loop->first || $extraHeadingColumn || $groupsOnly || ($loop->iteration > $headingColumnSpan)) && ($placeholderColumns || $column->hasSummary()))
            <td
                @if ($loop->first && (! $extraHeadingColumn) && (! $groupsOnly) && ($headingColumnSpan > 1))
                    colspan="{{ $headingColumnSpan }}"
                @endif
                @class([
                    "-space-y-3 align-top",
                    match ($column->getAlignment()) {
                        'start' => 'text-start',
                        'center' => 'text-center',
                        'end' => 'text-end',
                        'left' => 'text-left',
                        'right' => 'text-right',
                        'justify' => 'text-justify',
                        default => null,
                    },
                ])
            >
                @if ($loop->first && (! $extraHeadingColumn) && (! $groupsOnly))
                    <div class="px-4 py-3 font-medium text-sm">
                        {{ $heading }}
                    </div>
                @elseif ((! $placeholderColumns) || $column->hasSummary())
                    @foreach ($column->getSummarizers() as $summarizer)
                        {{ $summarizer->query($query)->selectedState($selectedState) }}
                    @endforeach
                @endif
            </td>
        @endif
    @endforeach

    @if ($placeholderColumns && $actions && in_array($actionsPosition, [ActionsPosition::AfterColumns, ActionsPosition::AfterCells]))
        <td></td>
    @endif

    @if ($placeholderColumns && $selectionEnabled && $recordCheckboxPosition === RecordCheckboxPosition::AfterCells)
        <td></td>
    @endif
</x-filament-tables::row>
`;
        const output = `@props([
    'actions' => false,
    'actionsPosition' => null,
    'columns',
    'extraHeadingColumn' => false,
    'groupsOnly' => false,
    'heading',
    'placeholderColumns' => true,
    'query',
    'selectionEnabled' => false,
    'selectedState',
    'strong' => false,
    'recordCheckboxPosition' => null,
])

@php
    use Filament\\Tables\\Actions\\Position as ActionsPosition;
    use Filament\\Tables\\Actions\\RecordCheckboxPosition;
@endphp

<x-filament-tables::row
    {{
    $attributes->class([
        'filament-tables-summary-row',
        'bg-gray-500/5' => $strong,
    ])
}}
>
    @if ($placeholderColumns && $actions && in_array($actionsPosition, [ActionsPosition::BeforeCells, ActionsPosition::BeforeColumns]))
        <td></td>
    @endif

    @if ($placeholderColumns && $selectionEnabled && $recordCheckboxPosition === RecordCheckboxPosition::BeforeCells)
        <td></td>
    @endif

    @if ($extraHeadingColumn || $groupsOnly)
        <td class="px-4 py-3 align-top text-sm font-medium">
            {{ $heading }}
        </td>
    @else
        @php
            $headingColumnSpan = 1;

            foreach ($columns as $index => $column) {
                if ($index === array_key_first($columns)) {
                    continue;
                }

                if ($column->hasSummary()) {
                    break;
                }

                $headingColumnSpan++;
            }
        @endphp
    @endif

    @foreach ($columns as $column)
        @if (($loop->first || $extraHeadingColumn || $groupsOnly || ($loop->iteration > $headingColumnSpan)) && ($placeholderColumns || $column->hasSummary()))
            <td
                @if ($loop->first && (! $extraHeadingColumn) && (! $groupsOnly) && ($headingColumnSpan > 1))
                    colspan="{{ $headingColumnSpan }}"
                @endif
                @class([
                    '-space-y-3 align-top',
                    match ($column->getAlignment()) {
                        'start' => 'text-start',
                        'center' => 'text-center',
                        'end' => 'text-end',
                        'left' => 'text-left',
                        'right' => 'text-right',
                        'justify' => 'text-justify',
                        default => null,
                    },
                ])
            >
                @if ($loop->first && (! $extraHeadingColumn) && (! $groupsOnly))
                    <div class="px-4 py-3 text-sm font-medium">
                        {{ $heading }}
                    </div>
                @elseif ((! $placeholderColumns) || $column->hasSummary())
                    @foreach ($column->getSummarizers() as $summarizer)
                        {{ $summarizer->query($query)->selectedState($selectedState) }}
                    @endforeach
                @endif
            </td>
        @endif
    @endforeach

    @if ($placeholderColumns && $actions && in_array($actionsPosition, [ActionsPosition::AfterColumns, ActionsPosition::AfterCells]))
        <td></td>
    @endif

    @if ($placeholderColumns && $selectionEnabled && $recordCheckboxPosition === RecordCheckboxPosition::AfterCells)
        <td></td>
    @endif
</x-filament-tables::row>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});