import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_columns_color_column_blade_php', () => {
    test('pint: it can format tables_resources_views_columns_color_column_blade_php', () => {
        const input = `@php
    $isCopyable = $isCopyable();
    $copyMessage = $getCopyMessage();
    $copyMessageDuration = $getCopyMessageDuration();
@endphp

<div {{
    $attributes
        ->merge($getExtraAttributes(), escape: false)
        ->class([
            'filament-tables-color-column flex flex-wrap gap-1',
            'px-4 py-3' => ! $isInline(),
        ])
}}>
    @foreach (\\Illuminate\\Support\\Arr::wrap($getState()) as $state)
        <div
            @if ($state)
                style="background-color: {{ $state }}"
                @if ($isCopyable)
                    x-on:click="
                        window.navigator.clipboard.writeText(@js($state))
                        $tooltip(@js($copyMessage), { timeout: @js($copyMessageDuration) })
                    "
                @endif
            @endif
            @class([
                'relative flex h-6 w-6 rounded-md',
                'cursor-pointer' => $isCopyable,
            ])
        >
        </div>
    @endforeach
</div>
`;
        const output = `@php
    $isCopyable = $isCopyable();
    $copyMessage = $getCopyMessage();
    $copyMessageDuration = $getCopyMessageDuration();
@endphp

<div
    {{
        $attributes
            ->merge($getExtraAttributes(), escape: false)
            ->class([
                'filament-tables-color-column flex flex-wrap gap-1',
                'px-4 py-3' => ! $isInline(),
            ])
    }}
>
    @foreach (\\Illuminate\\Support\\Arr::wrap($getState()) as $state)
        <div
            @if ($state)
                style="background-color: {{ $state }}"
                @if ($isCopyable)
                    x-on:click="
                        window.navigator.clipboard.writeText(@js($state))
                        $tooltip(@js($copyMessage), { timeout: @js($copyMessageDuration) })
                    "
                @endif
            @endif
            @class([
                'relative flex h-6 w-6 rounded-md',
                'cursor-pointer' => $isCopyable,
            ])
        ></div>
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});