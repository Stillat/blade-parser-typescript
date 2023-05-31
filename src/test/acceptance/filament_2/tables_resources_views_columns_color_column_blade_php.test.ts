import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_columns_color_column_blade_php', () => {
    test('pint: it can format tables_resources_views_columns_color_column_blade_php', () => {
        const input = `@php
    $state = $getState();
    $isCopyable = $isCopyable();
@endphp

<div
    @if ($state)
        style="background-color: {{ $state }}"
        @if ($isCopyable)
            x-on:click="
                window.navigator.clipboard.writeText(@js($state))
                $tooltip(@js($getCopyMessage()), { timeout: @js($getCopyMessageDuration()) })
            "
        @endif
    @endif
    {{
        $attributes
            ->merge($getExtraAttributes())
            ->class([
                'filament-tables-color-column relative ml-4 flex h-6 w-6 rounded-md',
                'cursor-pointer' => $isCopyable,
            ])
    }}
></div>
`;
        const output = `@php
    $state = $getState();
    $isCopyable = $isCopyable();
@endphp

<div
    @if ($state)
        style="background-color: {{ $state }}"
        @if ($isCopyable)
            x-on:click="
                window.navigator.clipboard.writeText(@js($state))
                $tooltip(@js($getCopyMessage()), { timeout: @js($getCopyMessageDuration()) })
            "
        @endif
    @endif
    {{
        $attributes
            ->merge($getExtraAttributes())
            ->class([
                'filament-tables-color-column relative ml-4 flex h-6 w-6 rounded-md',
                'cursor-pointer' => $isCopyable,
            ])
    }}
></div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});