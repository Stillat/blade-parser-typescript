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
        x-foo x-show="showUploadBox" x-collapse x-cloak
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
        x-show="showUploadBox" x-collapse x-cloak
        @thingconfig(! 'filament-media-library.settings.show-upload-box-by-default')
    @endsomething
    @if (config(! 'filament-media-library.settings.show-upload-box-by-default'))
        x-foo x-show="showUploadBox" x-collapse x-cloak
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
            x-show="showUploadBox" x-collapse x-cloak
            @thingconfig(! 'filament-media-library.settings.show-upload-box-by-default')
        @endsomething
        @if (config(! 'filament-media-library.settings.show-upload-box-by-default'))
            x-foo x-show="showUploadBox" x-collapse x-cloak
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
    });
});