import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_columns_image_column_blade_php', () => {
    test('pint: it can format tables_resources_views_columns_image_column_blade_php', () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes())->class([
    'filament-tables-image-column',
    'px-4 py-3' => ! $isInline(),
]) }}>
    @php
        $height = $getHeight();
        $width = $getWidth() ?? ($isCircular() || $isSquare() ? $height : null);
    @endphp

    <div
        style="
            {!! $height !== null ? "height: {$height};" : null !!}
            {!! $width !== null ? "width: {$width};" : null !!}
        "
        @class([
            'overflow-hidden' => $isCircular() || $isSquare(),
            'rounded-full' => $isCircular(),
        ])
    >
        @if ($path = $getImagePath())
            <img
                src="{{ $path }}"
                style="
                    {!! $height !== null ? "height: {$height};" : null !!}
                    {!! $width !== null ? "width: {$width};" : null !!}
                "
                {{ $getExtraImgAttributeBag()->class([
                    'object-cover object-center' => $isCircular() || $isSquare(),
                ]) }}
            >
       @endif
    </div>
</div>
`;
        const output = `<div
    {{
        $attributes->merge($getExtraAttributes())->class([
            'filament-tables-image-column',
            'px-4 py-3' => ! $isInline(),
        ])
    }}
>
    @php
        $height = $getHeight();
        $width = $getWidth() ?? ($isCircular() || $isSquare() ? $height : null);
    @endphp

    <div
        style="
            {!! $height !== null ? "height: {$height};" : null !!}
            {!! $width !== null ? "width: {$width};" : null !!}
        "
        @class([
            'overflow-hidden' => $isCircular() || $isSquare(),
            'rounded-full' => $isCircular(),
        ])
    >
        @if ($path = $getImagePath())
            <img
                src="{{ $path }}"
                style="
                    {!! $height !== null ? "height: {$height};" : null !!}
                    {!! $width !== null ? "width: {$width};" : null !!}
                "
                {{
                    $getExtraImgAttributeBag()->class([
                        'object-cover object-center' => $isCircular() || $isSquare(),
                    ])
                }}
            />
        @endif
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});