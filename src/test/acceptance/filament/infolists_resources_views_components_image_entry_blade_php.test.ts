import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: infolists_resources_views_components_image_entry_blade_php', () => {
    test('pint: it can format infolists_resources_views_components_image_entry_blade_php', () => {
        const input = `<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    @php
        $isCircular = $isCircular();
        $isSquare = $isSquare();
        $height = $getHeight();
        $width = $getWidth() ?? ($isCircular || $isSquare ? $height : null);
    @endphp

    <div {{ $attributes->merge($getExtraAttributes(), escape: false)->class([
        'filament-infolists-image-entry flex',
        match ($getAlignment()) {
            'center' => 'justify-center',
            'end' => 'justify-end',
            'left' => 'justify-left',
            'right' => 'justify-right',
            'start', null => 'justify-start',
        },
    ]) }}>
        <div
            style="
                @if ($height) height: {{ $height }}; @endif
                @if ($width) width: {{ $width }}; @endif
            "
            @class([
                'inline-block',
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
</x-dynamic-component>
`;
        const output = `<x-dynamic-component :component="$getEntryWrapperView()" :entry="$entry">
    @php
        $isCircular = $isCircular();
        $isSquare = $isSquare();
        $height = $getHeight();
        $width = $getWidth() ?? ($isCircular || $isSquare ? $height : null);
    @endphp

    <div
        {{
            $attributes->merge($getExtraAttributes(), escape: false)->class([
                'filament-infolists-image-entry flex',
                match ($getAlignment()) {
                    'center' => 'justify-center',
                    'end' => 'justify-end',
                    'left' => 'justify-left',
                    'right' => 'justify-right',
                    'start', null => 'justify-start',
                },
            ])
        }}
    >
        <div
            style="
                @if ($height) height: {{ $height }}; @endif
                @if ($width) width: {{ $width }}; @endif
            "
            @class([
                'inline-block',
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
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});