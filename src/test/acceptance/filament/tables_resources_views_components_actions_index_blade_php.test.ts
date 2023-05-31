import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_actions_index_blade_php', () => {
    test('pint: it can format tables_resources_views_components_actions_index_blade_php', () => {
        const input = `@props([
    'actions',
    'alignment' => null,
    'record' => null,
    'wrap' => false,
])

<div {{ $attributes->class([
    'filament-tables-actions-container flex items-center gap-4',
    'flex-wrap' => $wrap,
    'md:flex-nowrap' => $wrap === '-md',
    match ($alignment) {
        'center' => 'justify-center',
        'start', 'left' => 'justify-start',
        'start md:end', 'left md:right' => 'justify-start md:justify-end',
        default => 'justify-end',
    },
]) }}>
    @foreach ($actions as $action)
        @php
            if (! $action instanceof \\Filament\\Tables\\Actions\\BulkAction) {
                $action->record($record);
            }
        @endphp

        @if ($action->isVisible())
            {{ $action }}
        @endif
    @endforeach
</div>
`;
        const output = `@props([
    'actions',
    'alignment' => null,
    'record' => null,
    'wrap' => false,
])

<div
    {{
        $attributes->class([
            'filament-tables-actions-container flex items-center gap-4',
            'flex-wrap' => $wrap,
            'md:flex-nowrap' => $wrap === '-md',
            match ($alignment) {
                'center' => 'justify-center',
                'start', 'left' => 'justify-start',
                'start md:end', 'left md:right' => 'justify-start md:justify-end',
                default => 'justify-end',
            },
        ])
    }}
>
    @foreach ($actions as $action)
        @php
            if (! $action instanceof \\Filament\\Tables\\Actions\\BulkAction) {
                $action->record($record);
            }
        @endphp

        @if ($action->isVisible())
            {{ $action }}
        @endif
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});