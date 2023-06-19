import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: infolists_resources_views_components_color_entry_blade_php', () => {
    test('pint: it can format infolists_resources_views_components_color_entry_blade_php', () => {
        const input = `<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    <div {{ $attributes
        ->merge($getExtraAttributes(), escape: false)
        ->class([
            'filament-infolists-color-entry flex flex-wrap gap-1',
        ])
    }}>
        @php
            $isCopyable = $isCopyable();
            $copyMessage = $getCopyMessage();
            $copyMessageDuration = $getCopyMessageDuration();
        @endphp

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
</x-dynamic-component>
`;
        const output = `<x-dynamic-component :component="$getEntryWrapperView()" :entry="$entry">
    <div
        {{
            $attributes
                ->merge($getExtraAttributes(), escape: false)
                ->class([
                    'filament-infolists-color-entry flex flex-wrap gap-1',
                ])
        }}
    >
        @php
            $isCopyable = $isCopyable();
            $copyMessage = $getCopyMessage();
            $copyMessageDuration = $getCopyMessageDuration();
        @endphp

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
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});