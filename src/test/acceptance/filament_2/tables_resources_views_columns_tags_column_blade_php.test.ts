import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_tags_column_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_tags_column_blade_php', async () => {
        const input = `@php
    $state = $getTags();
@endphp

<div {{ $attributes->merge($getExtraAttributes())->class([
    'filament-tables-tags-column flex flex-wrap items-center gap-1',
    'px-4 py-3' => ! $isInline(),
    match ($getAlignment()) {
        'start' => 'justify-start',
        'center' => 'justify-center',
        'end' => 'justify-end',
        'left' => 'justify-start rtl:flex-row-reverse',
        'center' => 'justify-center',
        'right' => 'justify-end rtl:flex-row-reverse',
        default => null,
    },
]) }}>
    @foreach (array_slice($getTags(), 0, $getLimit()) as $tag)
        <span @class([
            'inline-flex items-center justify-center min-h-6 px-2 py-0.5 text-sm font-medium tracking-tight rounded-xl text-primary-700 bg-primary-500/10 whitespace-normal',
            'dark:text-primary-500' => config('tables.dark_mode'),
        ])>
            {{ $tag }}
        </span>
    @endforeach

    @if ($hasActiveLimit())
        <span class="ml-1 text-xs">
            {{ trans_choice('tables::table.columns.tags.more', count($getTags()) - $getLimit()) }}
        </span>
    @endif
</div>
`;
        const output = `@php
    $state = $getTags();
@endphp

<div
    {{
        $attributes->merge($getExtraAttributes())->class([
            'filament-tables-tags-column flex flex-wrap items-center gap-1',
            'px-4 py-3' => ! $isInline(),
            match ($getAlignment()) {
                'start' => 'justify-start',
                'center' => 'justify-center',
                'end' => 'justify-end',
                'left' => 'justify-start rtl:flex-row-reverse',
                'center' => 'justify-center',
                'right' => 'justify-end rtl:flex-row-reverse',
                default => null,
            },
        ])
    }}
>
    @foreach (array_slice($getTags(), 0, $getLimit()) as $tag)
        <span
            @class([
                'min-h-6 text-primary-700 bg-primary-500/10 inline-flex items-center justify-center whitespace-normal rounded-xl px-2 py-0.5 text-sm font-medium tracking-tight',
                'dark:text-primary-500' => config('tables.dark_mode'),
            ])
        >
            {{ $tag }}
        </span>
    @endforeach

    @if ($hasActiveLimit())
        <span class="ml-1 text-xs">
            {{ trans_choice('tables::table.columns.tags.more', count($getTags()) - $getLimit()) }}
        </span>
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});