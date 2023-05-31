import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Directives', () => {
    test('pint: it can format PHP in directives', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`@directive   ($test  + $that-$another   + $thing)`).trim(),
            `@directive($test + $that - $another + $thing)`
        );
    });

    test('pint: it preserves content if PHP is invalid', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`@directive   ($test  ++++ $that-$another   + $thing)`).trim(),
            `@directive($test  ++++ $that-$another   + $thing)`
        );
    });

    test('pint: it indents nicely', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`@section("messages")
    <div class="alert success">
        <p><strong>Success!</strong></p>
        @foreach ($success->all('<p>:message</p>') as $msg)
            {{ $msg }}
        @endforeach
    </div>
@show`).trim(),
            `@section('messages')
<div class="alert success">
    <p><strong>Success!</strong></p>
    @foreach ($success->all('<p>:message</p>') as $msg)
        {{ $msg }}
    @endforeach
</div>
@show`
        );

        assert.strictEqual(
            formatBladeStringWithPint(`
@section("messages")
<div class="alert success">
<p><strong>Success!</strong></p>
@foreach ($success->all('<p>:message</p>') as $msg)
{{ $msg }}
@endforeach
</div>
@show
`).trim(),
            `@section('messages')
<div class="alert success">
    <p><strong>Success!</strong></p>
    @foreach ($success->all('<p>:message</p>') as $msg)
        {{ $msg }}
    @endforeach
</div>
@show`
        );
    });

    test('pint: it indents if HTML is on separate lines', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>
            @directive   ($test  + $that-$another   + $thing)
                </div>`).trim(),
            `<div>
    @directive($test + $that - $another + $thing)
</div>`
        );
    });

    test('pint: it preserves same line if HTML is on same line', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>@directive   ($test  + $that-$another   + $thing)</div>`).trim(),
            `<div>@directive($test + $that - $another + $thing)</div>`
        );
    });

    test('pint: it can indent paired directives without any HTML hints', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: it can indent paired directives with HTML', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
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

    test('pint: virtual wrappers are not created for paired directives containing only inlined content', () => {
        const input = `
                @can('create', App\\Models\\User::class)
                {!! $something_here !!}
                @endcan
`;
        const out = `@can('create', App\\Models\\User::class)
    {!! $something_here !!}
@endcan
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it does not blindly remove newlines when formatting directive params', () => {
        const input = `@class([
            'foo' => true,
                    'bar'       => false,
                                 'bar2'                   => false,
        ])`;
        const out = `@class([
    'foo' => true,
    'bar' => false,
    'bar2' => false,
])
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it respects newline placement', () => {
        const input = `@class([
            'filament antialiased min-h-screen js-focus-visible',
            'dark' => filament()->hasDarkModeForced(),
        ])`;
        const out = `@class([
    'filament antialiased min-h-screen js-focus-visible',
    'dark' => filament()->hasDarkModeForced(),
])
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
        assert.strictEqual(formatBladeStringWithPint(out), out);
    });

    test('pint: it indents class directives nicely', () => {
        const input = `<div>
    <span @class([
        'some classes',
    ])>
        {{ $foo }}
    </span>
</div>`;
        const out = `<div>
    <span @class([
        'some classes',
    ])>
        {{ $foo }}
    </span>
</div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
        assert.strictEqual(formatBladeStringWithPint(out), out);

        const input2 = `<div>
    <span @class([
        'some classes',
    ])>
        {{ $foo }}
        
        </span> </div>`;
        
        assert.strictEqual(formatBladeStringWithPint(input2), out);
    });

    test('pint: it indents class directives nicely2', () => {
        const input = `<x-foo
@class([
    'foo',
    'foo bar baz something long very very long',
])
/>`;
        const output = `<x-foo
    @class([
        'foo',
        'foo bar baz something long very very long',
    ])
/>
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);
    });

    test('pint: it pairs guest', () => {
        const input = `@guest
<div></div>
@endguest`
        const out = `@guest
    <div></div>
@endguest
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it pairs unless', () => {
        const input = `@unless
<div></div>
@endunless`
        const out = `@unless
    <div></div>
@endunless
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it pairs sectionMissing', () => {
        const input = `@sectionMissing
<div></div>
@endsectionMissing`
        const out = `@sectionMissing
    <div></div>
@endsectionMissing
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it pairs hasSection', () => {
        const input = `@hasSection
<div></div>
@endhasSection`
        const out = `@hasSection
    <div></div>
@endhasSection
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it pairs auth', () => {
        const input = `@auth
<div></div>
@endauth`
        const out = `@auth
    <div></div>
@endauth
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it pairs env', () => {
        const input = `@env
<div></div>
@endenv`
        const out = `@env
    <div></div>
@endenv
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it pairs isset', () => {
        const input = `@isset
<div></div>
@endisset`
        const out = `@isset
    <div></div>
@endisset
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it pairs cannot', () => {
        const input = `@cannot
<div></div>
@endcannot`
        const out = `@cannot
    <div></div>
@endcannot
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });
    
    test('pint: it pairs canany', () => {
        const input = `@canany
<div></div>
@endcanany`
        const out = `@canany
    <div></div>
@endcanany
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });
    
    test('pint: it pairs hasSection', () => {
        const input = `@hasSection
<div></div>
@endhasSection`
        const out = `@hasSection
    <div></div>
@endhasSection
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });
    
    test('pint: it pairs production', () => {
        const input = `@production
<div></div>
@endproduction`
        const out = `@production
    <div></div>
@endproduction
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it formats class with match nicely', () => {
        const input = `
@class([
    'foo',
    match ($color) {
        'blue' => 'text-blue-500',
        'green' => 'text-green-500',
    },
])`;
        const output = `@class([
    'foo',
    match ($color) {
        'blue' => 'text-blue-500',
        'green' => 'text-green-500',
    },
])
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);
    });

    test('pint: it formats subdocuments correctly', () => {
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
        assert.strictEqual(formatBladeStringWithPint(input), output);
    });

    test('pint: it does not trash ifs inside elements', () => {
        const input = `

@if ($that)
    <div @if ($somethingElse) this! @endif>Hello, world.</div>
@endif
`;
        const out = `@if ($that)
    <div @if ($somethingElse) this! @endif>Hello, world.</div>
@endif
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it reflows operators inside directive simple arrays', () => {
        const input = `
@class([
    'foo' => ! true,
])
`;
        const output = `@class([
    'foo' => ! true,
])
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);
    });

    test('pint: it does not trash complex arrays', () => {
        const input = `@class([
            'text-sm font-medium leading-4',
            'text-gray-700' => !$error,
            'dark:text-gray-300' => !$error && config('forms.dark_mode'),
            'text-danger-700' => $error,
            'dark:text-danger-400' => $error && config('forms.dark_mode'),
        ])`;
        const output = `@class([
    'text-sm font-medium leading-4',
    'text-gray-700' => ! $error,
    'dark:text-gray-300' => ! $error && config('forms.dark_mode'),
    'text-danger-700' => $error,
    'dark:text-danger-400' => $error && config('forms.dark_mode'),
])
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);
    });

    test('pint: it can format mixed directive arg arrays', () => {
        const input = `@class([
    'grid auto-cols-fr grid-flow-col gap-2 text-sm',
    'ms-8' => $active,
])
`;
        const out = `@class([
    'grid auto-cols-fr grid-flow-col gap-2 text-sm',
    'ms-8' => $active,
])
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: really long directive array args without keys can be placed on separate lines', () => {
        const input = `
<div>
<div class="relative group max-w-md">
        <span
            @class([
                'absolute inset-y-0 left-0 flex items-center justify-center w-10 h-10 text-gray-500 pointer-events-none group-focus-within:text-primary-500',
                'dark:text-gray-400' => config('filament.dark_mode'),
            ])
        >
        </span>
        </div>
        </div>
`;
        const out = `<div>
    <div class="relative group max-w-md">
        <span
            @class([
                'absolute inset-y-0 left-0 flex items-center justify-center w-10 h-10 text-gray-500 pointer-events-none group-focus-within:text-primary-500',
                'dark:text-gray-400' => config('filament.dark_mode'),
            ])
        ></span>
    </div>
</div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
        assert.strictEqual(formatBladeStringWithPint(out), out);
    });

    test('pint: transformer results in the correct indentation', () => {
        const input = `<x-foo @class([
    'foo',
]) />

<x-foo @class([
   'foo2',
]) />`;
        const out = `<x-foo @class([
    'foo',
]) />

<x-foo @class([
    'foo2',
]) />
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it reflows attached content nicely', () => {
        const input = `@props([
    'error' => false,
    'prefix' => null,
    'required' => false,
    'suffix' => null,
])

<label {{ $attributes->class(['filament-forms-field-wrapper-label inline-flex items-center space-x-3 rtl:space-x-reverse']) }}>
    {{ $prefix }}

    <span @class([
        'text-sm font-medium leading-4',
        'text-gray-700' => ! $error,
        'dark:text-gray-300' => (! $error) && config('forms.dark_mode'),
        'text-danger-700' => $error,
        'dark:text-danger-400' => $error && config('forms.dark_mode'),
    ])>
        {{-- Deliberately poor formatting to ensure that the asterisk sticks to the final word in the label. --}}
        {{ $slot }}@if ($required)<span class="whitespace-nowrap">
                <sup @class([
                    'font-medium text-danger-700',
                    'dark:text-danger-400' => config('forms.dark_mode'),
                ])>*</sup>
            </span>
        @endif
    </span>

    {{ $suffix }}
</label>`;

        const expected = `@props([
    'error' => false,
    'prefix' => null,
    'required' => false,
    'suffix' => null,
])

<label
    {{ $attributes->class(['filament-forms-field-wrapper-label inline-flex items-center space-x-3 rtl:space-x-reverse']) }}
>
    {{ $prefix }}

    <span
        @class([
            'text-sm font-medium leading-4',
            'text-gray-700' => ! $error,
            'dark:text-gray-300' => (! $error) && config('forms.dark_mode'),
            'text-danger-700' => $error,
            'dark:text-danger-400' => $error && config('forms.dark_mode'),
        ])
    >
        {{-- Deliberately poor formatting to ensure that the asterisk sticks to the final word in the label. --}}
        {{ $slot }}@if ($required)<span class="whitespace-nowrap">
                <sup
                    @class([
                        'font-medium text-danger-700',
                        'dark:text-danger-400' => config('forms.dark_mode'),
                    ])
                >
                    *
                </sup>
            </span>
        @endif
    </span>

    {{ $suffix }}
</label>
`;
        assert.strictEqual(formatBladeStringWithPint(input), expected);
    });
});