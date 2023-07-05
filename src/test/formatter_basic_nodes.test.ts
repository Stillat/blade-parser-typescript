import assert from 'assert';
import { formatBladeString, formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Basic Node Formatting', () => {
    test('it formats echos', () => {
        assert.strictEqual(
            formatBladeString('{{ $title }}').trim(),
            "{{ $title }}"
        );
    });

    test('it formats echo variant', () => {
        assert.strictEqual(
            formatBladeString('{{{ $title }}}').trim(),
            "{{{ $title }}}"
        );
    });

    test('it formats escaped echos', () => {
        assert.strictEqual(
            formatBladeString('{!! $title !!}').trim(),
            "{!! $title !!}"
        );
    });

    test('it formats simple comments', () => {
        assert.strictEqual(
            formatBladeString('{{-- Comment. --}}').trim(),
            "{{-- Comment. --}}"
        );
    });

    test('it formats block comments', () => {
        assert.strictEqual(
            formatBladeString(`{{--
                Block Comment. --}}`).trim(),
            `{{--
    Block Comment.
--}}`
        );
    });

    test('it formats block comments with', () => {
        assert.strictEqual(
            formatBladeString(`{{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}`),
            `{{--
    Block Comment.
    with many lines and with <stuff></stuff>
--}}
`
        );
    });

    test('block comments inside a div', () => {
        assert.strictEqual(
            formatBladeString(`<div>
        {{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}
        </div>`).trim(),
            `<div>
    {{--
        Block Comment.
        with many lines and with <stuff></stuff>
    --}}
</div>`
        );
    });

    test('ignored fragmented elements are actually ignored', () => {
        const input = `
@if ($someCondition)
    {{-- format-ignore-start --}}<x-slot:the_slot>{{-- format-ignore-end --}}
@endif

    <!-- More content here. -->

@if ($someCondition)
    {{-- format-ignore-start --}}</x-slot>{{-- format-ignore-end --}}
@endif
`;
        const out = `@if ($someCondition)
    {{-- format-ignore-start --}}<x-slot:the_slot>{{-- format-ignore-end --}}
@endif

<!-- More content here. -->

@if ($someCondition)
    {{-- format-ignore-start --}}</x-slot>{{-- format-ignore-end --}}
@endif
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('comments can be formatted inside html elements', () => {
        const input = `

<div
    {{-- A comment! --}}
>
<p>Hello, world!</p>
</div>
`;
        const out = `<div {{-- A comment! --}}>
    <p>Hello, world!</p>
</div>
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('simple nodes can be formatted inside html content', () => {
        const input = `<div
    class="my-4"
    @unless(config('filament-media-library.settings.show-upload-box-by-default')) x-foo
         x-show="showUploadBox"
         x-collapse
         x-cloak
     @endunless
>
<p>Hello, world!</p>
</div>`;

        const out = `<div
    class="my-4"
    @unless (config("filament-media-library.settings.show-upload-box-by-default"))
        x-foo
        x-show="showUploadBox"
        x-collapse
        x-cloak
    @endunless
>
    <p>Hello, world!</p>
</div>
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it can format pairs inside html content', () => {
        const input = `
<div
    class="my-4"
    @something(!true)
    x-show="showUploadBox"
    x-collapse
    x-cloak
    @thingconfig(!"filament-media-library.settings.show-upload-box-by-default")
    @endsomething

    @if(config(!"filament-media-library.settings.show-upload-box-by-default")) x-foo
         x-show="showUploadBox"
         x-collapse
         x-cloak
         @thingconfig(!"filament-media-library.settings.show-upload-box-by-default")
     @else
        x-thing
     @endif
>
<p>Hello, world!</p>
</div>
<div>
<div
    class="my-4"
    @something(!true)
    x-show="showUploadBox"
    x-collapse
    x-cloak
    @thingconfig(!"filament-media-library.settings.show-upload-box-by-default")
    @endsomething

    @if(config(!"filament-media-library.settings.show-upload-box-by-default")) x-foo
         x-show="showUploadBox"
         x-collapse
         x-cloak
         @thingconfig(!"filament-media-library.settings.show-upload-box-by-default")
     @else
        x-thing
     @endif
>
<p>Hello, world!</p>
</div>
</div>

`;
        const output = `<div
    class="my-4"
    @something(! true)
        x-show="showUploadBox"
        x-collapse
        x-cloak
        @thingconfig(! 'filament-media-library.settings.show-upload-box-by-default')
    @endsomething
    @if (config(! 'filament-media-library.settings.show-upload-box-by-default'))
        x-foo
        x-show="showUploadBox"
        x-collapse
        x-cloak
        @thingconfig(! 'filament-media-library.settings.show-upload-box-by-default')
    @else
        x-thing
    @endif
>
    <p>Hello, world!</p>
</div>
<div>
    <div
        class="my-4"
        @something(! true)
            x-show="showUploadBox"
            x-collapse
            x-cloak
            @thingconfig(! 'filament-media-library.settings.show-upload-box-by-default')
        @endsomething
        @if (config(! 'filament-media-library.settings.show-upload-box-by-default'))
            x-foo
            x-show="showUploadBox"
            x-collapse
            x-cloak
            @thingconfig(! 'filament-media-library.settings.show-upload-box-by-default')
        @else
            x-thing
        @endif
    >
        <p>Hello, world!</p>
    </div>
</div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);
    });

    test('it formats subdocs with attributes', () => {
        const input = `

<span
    @class([
        $baseAffixClasses,
        'rounded-s-lg -me-px',
    ])
    @something (filled($statePath))
        x-bind:class="{
            'text-gray-400': ! (@js($statePath) in $wire.__instance.serverMemo.errors),
            'text-danger-400': (@js($statePath) in $wire.__instance.serverMemo.errors),
        }"
    @endsomething
>
    <x-filament::icon
        alias="forms::components.affixes.prefix"
        :name="$prefixIcon"
        size="h-5 w-5"
        class="filament-input-affix-icon"
    />
</span>
`;
        const output = `<span
    @class([
        $baseAffixClasses,
        '-me-px rounded-s-lg',
    ])
    @something(filled($statePath))
        x-bind:class="{
            'text-gray-400': ! (@js($statePath) in $wire.__instance.serverMemo.errors),
            'text-danger-400': @js($statePath) in $wire.__instance.serverMemo.errors,
        }"
    @endsomething
>
    <x-filament::icon
        alias="forms::components.affixes.prefix"
        :name="$prefixIcon"
        size="h-5 w-5"
        class="filament-input-affix-icon"
    />
</span>
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);

    });

    test('it can format nested ifs and subdocs without an infinite loop', () => {
        const input = `

@if ($prefixIcon)
<span
    @class([
        $baseAffixClasses,
        'rounded-s-lg -me-px',
    ])
    @something (filled($statePath))
        x-bind:class="{
            'text-gray-400': ! (@js($statePath) in $wire.__instance.serverMemo.errors),
            'text-danger-400': (@js($statePath) in $wire.__instance.serverMemo.errors),
        }"
    @endsomething
>
    <x-filament::icon
        alias="forms::components.affixes.prefix"
        :name="$prefixIcon"
        size="h-5 w-5"
        class="filament-input-affix-icon"
    />
</span>
@endif
`;
        const output = `@if ($prefixIcon)
    <span
        @class([
            $baseAffixClasses,
            '-me-px rounded-s-lg',
        ])
        @something(filled($statePath))
            x-bind:class="{
                'text-gray-400': ! (@js($statePath) in $wire.__instance.serverMemo.errors),
                'text-danger-400': @js($statePath) in $wire.__instance.serverMemo.errors,
            }"
        @endsomething
    >
        <x-filament::icon
            alias="forms::components.affixes.prefix"
            :name="$prefixIcon"
            size="h-5 w-5"
            class="filament-input-affix-icon"
        />
    </span>
@endif
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);
    });

    test('it indents simple content inside pairs used as html attributes', () => {
        const input = `<div>
<div>
<input type="text"
    @if ((! $canEditKeys()) || $isDisabled)
    disabled
    @endif
    />
</div>
</div>`;
        const out = `<div>
    <div>
        <input
            type="text"
            @if ((! $canEditKeys()) || $isDisabled)
                disabled
            @endif
        />
    </div>
</div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('it indents simple content at the root', () => {
        const input = `


<div
@if ((! $canEditKeys()) || $isDisabled)
disabled
@endif
></div>
`;
        const out = `<div
    @if ((! $canEditKeys()) || $isDisabled)
        disabled
    @endif
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('it can indent a lot of attributes inside a condition', () => {
        const input = `


        <div
        @if (filament()->isSidebarCollapsibleOnDesktop())
            x-show="$store.sidebar.isOpen"
            x-transition:enter="delay-100 lg:transition"
            x-transition:enter-start="opacity-0"
            x-transition:enter-end="opacity-100"
        @endif
        ></div>
        `;
        const out = `<div
    @if (filament()->isSidebarCollapsibleOnDesktop())
        x-show="$store.sidebar.isOpen"
        x-transition:enter="delay-100 lg:transition"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
    @endif
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('it can indent attributes without content inside conditional attributes', () => {
        const input = `

<table>
<tbody
@if ($reorderable)
        x-sortable
    x-on:end.stop="$wire.reorderTable($event.target.sortable.toArray())"
@endif
class="divide-y whitespace-nowrap dark:divide-gray-700"
>
{{ $slot }}
</tbody>
</table>
`;
        const out = `<table>
    <tbody
        @if ($reorderable)
            x-sortable
            x-on:end.stop="$wire.reorderTable($event.target.sortable.toArray())"
        @endif
        class="divide-y whitespace-nowrap dark:divide-gray-700"
    >
        {{ $slot }}
    </tbody>
</table>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('complex conditional html attributes', () => {
        const input = `
        <table>
            <tbody
                @if ($reorderable)
                    x-sortable
                    x-on:end.stop="$wire.reorderTable($event.target.sortable.toArray())"
                @endif
                class="divide-y whitespace-nowrap dark:divide-gray-700"
            >
                {{ $slot }}
            </tbody>
        </table>
        
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
        `;
        const out = `<table>
    <tbody
        @if ($reorderable)
            x-sortable
            x-on:end.stop="$wire.reorderTable($event.target.sortable.toArray())"
        @endif
        class="divide-y whitespace-nowrap dark:divide-gray-700"
    >
        {{ $slot }}
    </tbody>
</table>

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
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('it doe not break semicolon placement', () => {
        const input = `
<textarea
@if ($shouldAutosize())
    x-ignore ax-load
    ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('textarea', 'filament/forms') }}"
    x-data="textareaFormComponent()"
    x-on:input="render()"
    style="height: 150px"
    {{ $getExtraAlpineAttributeBag() }}
@endif
>
</textarea>
`;
        const out = `<textarea
    @if ($shouldAutosize())
        x-ignore ax-load
        ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('textarea', 'filament/forms') }}"
        x-data="textareaFormComponent()"
        x-on:input="render()"
        style="height: 150px"
        {{ $getExtraAlpineAttributeBag() }}
    @endif
></textarea>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('nicely indent code is not indented more', () => {
        const input = `
<div
    x-transition:enter="ease duration-300"
    x-transition:leave="ease duration-300"
    @if ($slideOver)
        x-transition:enter-start="translate-x-full rtl:-translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full rtl:-translate-x-full"
    @elseif ($width !== 'screen')
        x-transition:enter-start="translate-y-8"
        x-transition:enter-end="translate-y-0"
        x-transition:leave-start="translate-y-0"
        x-transition:leave-end="translate-y-8"
    @endif
></div>

`;
        const out = `<div
    x-transition:enter="ease duration-300"
    x-transition:leave="ease duration-300"
    @if ($slideOver)
        x-transition:enter-start="translate-x-full rtl:-translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full rtl:-translate-x-full"
    @elseif ($width !== 'screen')
        x-transition:enter-start="translate-y-8"
        x-transition:enter-end="translate-y-0"
        x-transition:leave-start="translate-y-0"
        x-transition:leave-end="translate-y-8"
    @endif
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('it can indent nested conditions', () => {
        const input = `
<{!! $tag !!}
    @if ($url)
        href="{{ $url }}"
        @if ($shouldOpenUrlInNewTab()) target="_blank" @endif
    @endif
>
</{!! $tag !!}>
`;
        const out = `<{!! $tag !!}
    @if ($url)
        href="{{ $url }}"
        @if ($shouldOpenUrlInNewTab())
            target="_blank"
        @endif
    @endif
></{!! $tag !!}>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('simple conditions do not get weird wrapping', () => {
        const input = `
<div
@if ($closeByClickingAway)
    @if (filled($id))
        x-on:click="$dispatch('{{ $closeEventName }}', { id: '{{ $id }}' })"
    @else
        x-on:click="close()"
    @endif
@endif
>
</div>
`;
        const out = `<div
    @if ($closeByClickingAway)
        @if (filled($id))
            x-on:click="$dispatch('{{ $closeEventName }}', { id: '{{ $id }}' })"
        @else
            x-on:click="close()"
        @endif
    @endif
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });
});