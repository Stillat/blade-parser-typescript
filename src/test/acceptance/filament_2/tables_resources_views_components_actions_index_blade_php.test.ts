import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_actions_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_actions_index_blade_php', async () => {
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
    match ($alignment ?? config('tables.layout.action_alignment') ?? config('tables.layout.actions.cell.alignment')) {
        'center' => 'justify-center',
        'left' => 'justify-start',
        'left md:right' => 'justify-start md:justify-end',
        default => 'justify-end',
    },
]) }}>
    @foreach ($actions as $action)
        @if (! $action->record($record)->isHidden())
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
            match ($alignment ?? config('tables.layout.action_alignment') ?? config('tables.layout.actions.cell.alignment')) {
                'center' => 'justify-center',
                'left' => 'justify-start',
                'left md:right' => 'justify-start md:justify-end',
                default => 'justify-end',
            },
        ])
    }}
>
    @foreach ($actions as $action)
        @if (! $action->record($record)->isHidden())
            {{ $action }}
        @endif
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});