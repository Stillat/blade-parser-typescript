import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_image_column_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_image_column_blade_php', async () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes(), escape: false)->class([
    'filament-tables-image-column',
    'px-4 py-3' => ! $isInline(),
]) }}>
    @php
        $isCircular = $isCircular();
        $isSquare = $isSquare();
        $height = $getHeight();
        $width = $getWidth() ?? ($isCircular || $isSquare ? $height : null);
    @endphp

    <div
        style="
            @if ($height) height: {{ $height }}; @endif
            @if ($width) width: {{ $width }}; @endif
        "
        @class([
            'overflow-hidden' => $isCircular || $isSquare,
            'rounded-full' => $isCircular,
        ])
    >
        @if ($path = $getImagePath())
            <img
                src="{{ $path }}"
                style="
                    @if ($height) height: {{ $height }}; @endif
                    @if ($width) width: {{ $width }}; @endif
                "
                {{ $getExtraImgAttributeBag()->class([
                    'object-cover object-center' => $isCircular || $isSquare,
                ]) }}
            >
       @endif
    </div>
</div>
`;
        const output = `<div
    {{
        $attributes->merge($getExtraAttributes(), escape: false)->class([
            'filament-tables-image-column',
            'px-4 py-3' => ! $isInline(),
        ])
    }}
>
    @php
        $isCircular = $isCircular();
        $isSquare = $isSquare();
        $height = $getHeight();
        $width = $getWidth() ?? ($isCircular || $isSquare ? $height : null);
    @endphp

    <div
        style="
            @if ($height) height: {{ $height }}; @endif
            @if ($width) width: {{ $width }}; @endif
        "
        @class([
            'overflow-hidden' => $isCircular || $isSquare,
            'rounded-full' => $isCircular,
        ])
    >
        @if ($path = $getImagePath())
            <img
                src="{{ $path }}"
                style="
                    @if ($height) height: {{ $height }}; @endif
                    @if ($width) width: {{ $width }}; @endif
                "
                {{
                    $getExtraImgAttributeBag()->class([
                        'object-cover object-center' => $isCircular || $isSquare,
                    ])
                }}
            />
        @endif
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});