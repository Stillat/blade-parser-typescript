import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Directives Formatting', () => {
    test('it can format PHP in directives', () => {
        assert.strictEqual(
            formatBladeString(`@directive   ($test  + $that-$another   + $thing)`).trim(),
            `@directive($test + $that - $another + $thing)`
        );
    });

    test('it preserves content if PHP is invalid', () => {
        assert.strictEqual(
            formatBladeString(`@directive   ($test  ++++ $that-$another   + $thing)`).trim(),
            `@directive($test  ++++ $that-$another   + $thing)`
        );
    });

    test('it indents nicely', () => {
        assert.strictEqual(
            formatBladeString(`@section("messages")
    <div class="alert success">
        <p><strong>Success!</strong></p>
        @foreach ($success->all('<p>:message</p>') as $msg)
            {{ $msg }}
        @endforeach
    </div>
@show`).trim(),
            `@section("messages")
<div class="alert success">
    <p><strong>Success!</strong></p>
    @foreach ($success->all('<p>:message</p>') as $msg)
        {{ $msg }}
    @endforeach
</div>
@show`
        );

        assert.strictEqual(
            formatBladeString(`
@section("messages")
<div class="alert success">
<p><strong>Success!</strong></p>
@foreach ($success->all('<p>:message</p>') as $msg)
{{ $msg }}
@endforeach
</div>
@show
`).trim(),
            `@section("messages")
<div class="alert success">
    <p><strong>Success!</strong></p>
    @foreach ($success->all('<p>:message</p>') as $msg)
        {{ $msg }}
    @endforeach
</div>
@show`
        );
    });

    test('it indents if HTML is on separate lines', () => {
        assert.strictEqual(
            formatBladeString(`<div>
            @directive   ($test  + $that-$another   + $thing)
                </div>`).trim(),
            `<div>
    @directive($test + $that - $another + $thing)
</div>`
        );
    });

    test('it preserves same line if HTML is on same line', () => {
        assert.strictEqual(
            formatBladeString(`<div>@directive   ($test  + $that-$another   + $thing)</div>`).trim(),
            `<div>@directive($test + $that - $another + $thing)</div>`
        );
    });

    test('it can indent paired directives without any HTML hints', () => {
        assert.strictEqual(
            formatBladeString(`
<div>
    @pair
dasdfsdf
asdf
@endpair
            </div>`).trim(),
            `<div>
    @pair
        dasdfsdf asdf
    @endpair
</div>`
        );
    });

    test('it can indent paired directives with HTML', () => {
        assert.strictEqual(
            formatBladeString(`
<div>
    @pair

<div>
    @pair
    <p>Test one.</p>
    
    
<div>
    @pair

<div>
    @pair
    <p>Test two.</p>


<div>
    @pair

<div>
    @pair
    <p>Test three.</p>
    @endpair
</div>

@endpair
            </div>

    @endpair
</div>

@endpair
            </div>

    @endpair
</div>

@endpair
            </div>`).trim(),
            `<div>
    @pair
        <div>
            @pair
                <p>Test one.</p>

                <div>
                    @pair
                        <div>
                            @pair
                                <p>Test two.</p>

                                <div>
                                    @pair
                                        <div>
                                            @pair
                                                <p>Test three.</p>
                                            @endpair
                                        </div>
                                    @endpair
                                </div>
                            @endpair
                        </div>
                    @endpair
                </div>
            @endpair
        </div>
    @endpair
</div>`
        );
    });

    test('virtual wrappers are not created for paired directives containing only inlined content', () => {
        const input = `
                @can('create', App\\Models\\User::class)
                {!! $something_here !!}
                @endcan
`;
        const out = `@can('create', App\\Models\\User::class)
    {!! $something_here !!}
@endcan
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it does not blindly remove newlines when formatting directive params', () => {
        const input = `@class([
            'foo' => true,
                    'bar'       => false,
                                 'bar2'                   => false,
        ])`;
        const out = `@class([
    "foo" => true,
    "bar" => false,
    "bar2" => false,
])
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it respects newline placement', () => {
        const input = `@class([
            'filament antialiased min-h-screen js-focus-visible',
            'dark' => filament()->hasDarkModeForced(),
        ])`;
        const out = `@class([
    "filament antialiased min-h-screen js-focus-visible",
    "dark" => filament()->hasDarkModeForced(),
])
`;
        assert.strictEqual(formatBladeString(input), out);
        assert.strictEqual(formatBladeString(out), out);
    });

    test('it indents class directives nicely', () => {
        const input = `<div>
    <span @class([
        'some classes',
    ])>
        {{ $foo }}
    </span>
</div>`;
        const out = `<div>
    <span @class([
        "some classes",
    ])>
        {{ $foo }}
    </span>
</div>
`;
        assert.strictEqual(formatBladeString(input), out);
        assert.strictEqual(formatBladeString(out), out);

        const input2 = `<div>
    <span @class([
        'some classes',
    ])>
        {{ $foo }}
        
        </span> </div>`;
        
        assert.strictEqual(formatBladeString(input2), out);
    });

    test('it indents class directives nicely2', () => {
        const input = `<x-foo
@class([
    'foo',
    'foo bar baz something long very very long',
])
/>`;
        const output = `<x-foo
    @class([
        "foo",
        "foo bar baz something long very very long",
    ])
/>
`;
        assert.strictEqual(formatBladeString(input), output);
    });

    test('it pairs guest', () => {
        const input = `@guest
<div></div>
@endguest`
        const out = `@guest
    <div></div>
@endguest
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it pairs unless', () => {
        const input = `@unless
<div></div>
@endunless`
        const out = `@unless
    <div></div>
@endunless
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it pairs sectionMissing', () => {
        const input = `@sectionMissing
<div></div>
@endsectionMissing`
        const out = `@sectionMissing
    <div></div>
@endsectionMissing
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it pairs hasSection', () => {
        const input = `@hasSection
<div></div>
@endhasSection`
        const out = `@hasSection
    <div></div>
@endhasSection
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it pairs auth', () => {
        const input = `@auth
<div></div>
@endauth`
        const out = `@auth
    <div></div>
@endauth
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it pairs env', () => {
        const input = `@env
<div></div>
@endenv`
        const out = `@env
    <div></div>
@endenv
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it pairs isset', () => {
        const input = `@isset
<div></div>
@endisset`
        const out = `@isset
    <div></div>
@endisset
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it pairs cannot', () => {
        const input = `@cannot
<div></div>
@endcannot`
        const out = `@cannot
    <div></div>
@endcannot
`;
        assert.strictEqual(formatBladeString(input), out);
    });
    
    test('it pairs canany', () => {
        const input = `@canany
<div></div>
@endcanany`
        const out = `@canany
    <div></div>
@endcanany
`;
        assert.strictEqual(formatBladeString(input), out);
    });
    
    test('it pairs hasSection', () => {
        const input = `@hasSection
<div></div>
@endhasSection`
        const out = `@hasSection
    <div></div>
@endhasSection
`;
        assert.strictEqual(formatBladeString(input), out);
    });
    
    test('it pairs production', () => {
        const input = `@production
<div></div>
@endproduction`
        const out = `@production
    <div></div>
@endproduction
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it formats class with match nicely', () => {
        const input = `
@class([
    'foo',
    match ($color) {
        'blue' => 'text-blue-500',
        'green' => 'text-green-500',
    },
])`;
        const output = `@class([
    "foo",
    match ($color) {
        "blue" => "text-blue-500",
        "green" => "text-green-500",
    },
])
`;
        assert.strictEqual(formatBladeString(input), output);
    });

    test('it formats subdocuments correctly', () => {
        const input = `

               @once
               <li>
               <button
                   type="button"
                   wire:loading.attr="disabled"
               >
                   <x-component::name
                       class="w-4 h-4 text-primary-500"
                       wire:loading.delay
                       wire:target="{{ one }} {{ two }}"
                   />
               </button>
           </li>
               @endonce
`;
        const output = `@once
    <li>
        <button type="button" wire:loading.attr="disabled">
            <x-component::name
                class="w-4 h-4 text-primary-500"
                wire:loading.delay
                wire:target="{{ one }} {{ two }}"
            />
        </button>
    </li>
@endonce
`;
        assert.strictEqual(formatBladeString(input), output);
    });

    test('it does not trash ifs inside elements', () => {
        const input = `

@if ($that)
    <div @if ($somethingElse) this! @endif>Hello, world.</div>
@endif
`;
        const out = `@if ($that)
    <div @if ($somethingElse) this! @endif>Hello, world.</div>
@endif
`;
        assert.strictEqual(formatBladeString(input), out);
    });

    test('it reflows operators inside directive simple arrays', () => {
        const input = `
@class([
    'foo' => ! true,
])
`;
        const output = `@class([
    "foo" => ! true,
])
`;
        assert.strictEqual(formatBladeString(input), output);
    });
});
