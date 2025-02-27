import assert from 'assert';
import { formatBladeString, formatBladeStringWithPint } from '../formatting/prettier/utils.js';
import { setupTestHooks } from './testUtils/formatting.js';

suite('Directives Formatting', () => {
    setupTestHooks();

    test('it can format PHP in directives', async () => {
        assert.strictEqual(
            (await formatBladeString(`@directive   ($test  + $that-$another   + $thing)`)).trim(),
            `@directive($test + $that - $another + $thing)`
        );
    });

    test('it preserves content if PHP is invalid', async () => {
        assert.strictEqual(
            (await formatBladeString(`@directive   ($test  ++++ $that-$another   + $thing)`)).trim(),
            `@directive($test  ++++ $that-$another   + $thing)`
        );
    });

    test('it indents nicely', async () => {
        assert.strictEqual(
            (await formatBladeString(`@section("messages")
    <div class="alert success">
        <p><strong>Success!</strong></p>
        @foreach ($success->all('<p>:message</p>') as $msg)
            {{ $msg }}
        @endforeach
    </div>
@show`)).trim(),
            `@section("messages")
<div class="alert success">
    <p><strong>Success!</strong></p>
    @foreach ($success->all("<p>:message</p>") as $msg)
        {{ $msg }}
    @endforeach
</div>
@show`
        );

        test('it formats foreach with uppecase', async () => {
            const template = `@Foreach($filters as $item)
  <li class="list-unstyled">
    <a href="{{ $item->link }}" class="{{ $item->active ? 'fw-bold text-primary' : '' }}">
                    {{ $item->name }}
    </a>
  </li>
@endforeach`;
            const expected = `@Foreach($filters as $item)
<li class="list-unstyled">
    <a
        href="{{ $item->link }}"
        class="{{ $item->active ? "fw-bold text-primary" : "" }}"
    >
        {{ $item->name }}
    </a>
</li>
@endforeach
`;
            const result = await formatBladeString(template);
            assert.strictEqual(result, expected);
        });

        assert.strictEqual(
            (await formatBladeString(`
@section("messages")
<div class="alert success">
<p><strong>Success!</strong></p>
@foreach ($success->all('<p>:message</p>') as $msg)
{{ $msg }}
@endforeach
</div>
@show
`)).trim(),
            `@section("messages")
<div class="alert success">
    <p><strong>Success!</strong></p>
    @foreach ($success->all("<p>:message</p>") as $msg)
        {{ $msg }}
    @endforeach
</div>
@show`
        );
    });

    test('it indents if HTML is on separate lines', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div>
            @directive   ($test  + $that-$another   + $thing)
                </div>`)).trim(),
            `<div>
    @directive($test + $that - $another + $thing)
</div>`
        );
    });

    test('it preserves same line if HTML is on same line', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div>@directive   ($test  + $that-$another   + $thing)</div>`)).trim(),
            `<div>@directive($test + $that - $another + $thing)</div>`
        );
    });

    test('it can indent paired directives without any HTML hints', async () => {
        assert.strictEqual(
            (await formatBladeString(`
<div>
    @pair
dasdfsdf
asdf
@endpair
            </div>`)).trim(),
            `<div>
    @pair
        dasdfsdf asdf
    @endpair
</div>`
        );
    });

    test('it can indent paired directives with HTML', async () => {
        assert.strictEqual(
            (await formatBladeString(`
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
            </div>`)).trim(),
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

    test('virtual wrappers are not created for paired directives containing only inlined content', async () => {
        const input = `
                @can('create', App\\Models\\User::class)
                {!! $something_here !!}
                @endcan
`;
        const out = `@can("create", App\\Models\\User::class)
    {!! $something_here !!}
@endcan
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it does not blindly remove newlines when formatting directive params', async () => {
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
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it respects newline placement', async () => {
        const input = `@class([
            'filament antialiased min-h-screen js-focus-visible',
            'dark' => filament()->hasDarkModeForced(),
        ])`;
        const out = `@class([
    "filament js-focus-visible min-h-screen antialiased",
    "dark" => filament()->hasDarkModeForced(),
])
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it indents class directives nicely', async () => {
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
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);

        const input2 = `<div>
    <span @class([
        'some classes',
    ])>
        {{ $foo }}
        
        </span> </div>`;
        
        assert.strictEqual(await formatBladeString(input2), out);
    });

    test('it indents class directives nicely2', async () => {
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
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('it pairs guest', async () => {
        const input = `@guest
<div></div>
@endguest`
        const out = `@guest
    <div></div>
@endguest
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs unless', async () => {
        const input = `@unless
<div></div>
@endunless`
        const out = `@unless
    <div></div>
@endunless
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs sectionMissing', async () => {
        const input = `@sectionMissing
<div></div>
@endsectionMissing`
        const out = `@sectionMissing
    <div></div>
@endsectionMissing
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs hasSection', async () => {
        const input = `@hasSection
<div></div>
@endhasSection`
        const out = `@hasSection
    <div></div>
@endhasSection
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs auth', async () => {
        const input = `@auth
<div></div>
@endauth`
        const out = `@auth
    <div></div>
@endauth
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs feature', async () => {
        const input = `@feature("api")
<div></div>
@endfeature`
        const out = `@feature("api")
    <div></div>
@endfeature
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs featureany', async () => {
        const input = `@featureany(["api-v1","api-v2"])
<div></div>
@endfeatureany`
        const out = `@featureany(["api-v1", "api-v2"])
    <div></div>
@endfeatureany
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs env', async () => {
        const input = `@env
<div></div>
@endenv`
        const out = `@env
    <div></div>
@endenv
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs isset', async () => {
        const input = `@isset
<div></div>
@endisset`
        const out = `@isset
    <div></div>
@endisset
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it pairs cannot', async () => {
        const input = `@cannot
<div></div>
@endcannot`
        const out = `@cannot
    <div></div>
@endcannot
`;
        assert.strictEqual(await formatBladeString(input), out);
    });
    
    test('it pairs canany', async () => {
        const input = `@canany
<div></div>
@endcanany`
        const out = `@canany
    <div></div>
@endcanany
`;
        assert.strictEqual(await formatBladeString(input), out);
    });
    
    test('it pairs hasSection', async () => {
        const input = `@hasSection
<div></div>
@endhasSection`
        const out = `@hasSection
    <div></div>
@endhasSection
`;
        assert.strictEqual(await formatBladeString(input), out);
    });
    
    test('it pairs production', async () => {
        const input = `@production
<div></div>
@endproduction`
        const out = `@production
    <div></div>
@endproduction
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it formats class with match nicely', async () => {
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
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('it formats subdocuments correctly', async () => {
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
                class="text-primary-500 h-4 w-4"
                wire:loading.delay
                wire:target="{{ one }} {{ two }}"
            />
        </button>
    </li>
@endonce
`;
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('it does not trash ifs inside elements', async () => {
        const input = `

@if ($that)
    <div @if ($somethingElse) this! @endif>Hello, world.</div>
@endif
`;
        const out = `@if ($that)
    <div @if ($somethingElse) this! @endif>Hello, world.</div>
@endif
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it reflows operators inside directive simple arrays', async () => {
        const input = `
@class([
    'foo' => ! true,
])
`;
        const output = `@class([
    "foo" => ! true,
])
`;
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('it does not trash complex arrays', async () => {
        const input = `@class([
            'text-sm font-medium leading-4',
            'text-gray-700' => !$error,
            'dark:text-gray-300' => !$error && config('forms.dark_mode'),
            'text-danger-700' => $error,
            'dark:text-danger-400' => $error && config('forms.dark_mode'),
        ])`;
        const output = `@class([
    "text-sm font-medium leading-4",
    "text-gray-700" => ! $error,
    "dark:text-gray-300" => ! $error && config("forms.dark_mode"),
    "text-danger-700" => $error,
    "dark:text-danger-400" => $error && config("forms.dark_mode"),
])
`;
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('it can format mixed directive arg arrays', async () => {
        const input = `@class([
    'grid auto-cols-fr grid-flow-col gap-2 text-sm',
    'ms-8' => $active,
])
`;
        const out = `@class([
    "grid auto-cols-fr grid-flow-col gap-2 text-sm",
    "ms-8" => $active,
])
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('really long directive array args without keys can be placed on separate lines', async () => {
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
    <div class="group relative max-w-md">
        <span
            @class([
                "group-focus-within:text-primary-500 pointer-events-none absolute inset-y-0 left-0 flex h-10 w-10 items-center justify-center text-gray-500",
                "dark:text-gray-400" => config("filament.dark_mode"),
            ])
        ></span>
    </div>
</div>
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('directives inside html classes do not wreck output', async () => {
        const template = `<div class="@something here @endSomething h-3 rounded-full border border-white"></div>`;
        const out = `<div
    class="@something here @endSomething h-3 rounded-full border border-white"
></div>
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('directives with underscores', async () => {
        const input = `

<div>
@some_directive
</div>

`;
        const out = `<div>
    @some_directive
</div>
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('directives with literal content do not get indented too much when deeply nested', async () => {
        let input = `
@props([
    'navigation',
])

<x-something><x-something><x-something><x-something><x-something><x-something><x-something>
                            @if ($loop->index)
                            &ensp;&ensp;
                    @endif
</x-something></x-something></x-something></x-something></x-something></x-something></x-something>
                            
`;
        let expected = `@props([
    "navigation",
])

<x-something>
    <x-something>
        <x-something>
            <x-something>
                <x-something>
                    <x-something>
                        <x-something>
                            @if ($loop->index)
                                &ensp;&ensp;
                            @endif
                        </x-something>
                    </x-something>
                </x-something>
            </x-something>
        </x-something>
    </x-something>
</x-something>
`;
        const out = await formatBladeString(input),
            out2 = await formatBladeString(out);
        assert.strictEqual(out, expected);
        assert.strictEqual(out2, expected);
    });

    test('it does not trash comments inside directive args', async () => {
        const template = `<img
@class([
  // This is valid a comment.
  $coverUrl ? "object-center" :"object-left-top",
])
/>`;
        const expected = `<img
    @class([
        // This is valid a comment.
        $coverUrl ? "object-center" : "object-left-top",
    ])
/>
`;
        let result = await formatBladeString(template);

        assert.strictEqual(result, expected);

        for (let i = 0; i < 5; i++) {
            result = await formatBladeString(result);

            assert.strictEqual(result, expected);
        }
    });

    test('it does not remove whitespace complicated directive args', async () => {
        const template = `<img
@class([
  $coverUrl ? "object-center" :"object-left-top",
])
/>`;
        // Unfortunately this will be the result.
        const expected = `<img @class([$coverUrl ? "object-center" : "object-left-top"]) />
`;
        const result = await formatBladeString(template);
        assert.strictEqual(result, expected);
    });

    test('the manual prettier array workaround works', async () => {
        const template = `<img
@class([
  $coverUrl ? "object-center" :"object-left-top", //
])
/>`;
        const expected = `<img @class([
    $coverUrl ? "object-center" : "object-left-top", //
]) />
`;
        const result = await formatBladeString(template);
        assert.strictEqual(result, expected);
    });

    test('it doesnt eat spaces on css utilities', async () => {
        const template = `<!DOCTYPE html>
<html>
    <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style type="text/tailwindcss">
            @layer components {
                .btn {
                    @apply rounded-full leading-4;
                    color: white;
                }
            }
        </style>
        <style type="text/tailwindcss">
            @layer components {
                .btn {
                    @apply rounded-full leading-4;
                    color: white;
                }
            }
        </style>
        <style type="text/tailwindcss">
            @layer components {
                .btn {
                    @apply rounded-full leading-4;
                    color: white;
                }
            }
        </style>
        <style type="text/tailwindcss">
            @layer components {
                .btn {
                    @apply rounded-full leading-4;
                    color: white;
                }
            }
        </style>
    </head>
    <body>
        Hello
    </body>
</html>`;
        const expected = `<!DOCTYPE html>
<html>
    <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style type="text/tailwindcss">
            @layer components {
                .btn {
                    @apply rounded-full leading-4;
                    color: white;
                }
            }
        </style>
        <style type="text/tailwindcss">
            @layer components {
                .btn {
                    @apply rounded-full leading-4;
                    color: white;
                }
            }
        </style>
        <style type="text/tailwindcss">
            @layer components {
                .btn {
                    @apply rounded-full leading-4;
                    color: white;
                }
            }
        </style>
        <style type="text/tailwindcss">
            @layer components {
                .btn {
                    @apply rounded-full leading-4;
                    color: white;
                }
            }
        </style>
    </head>
    <body>
        Hello
    </body>
</html>
`;
        let result = await formatBladeString(template);
        assert.strictEqual(result, expected);

        for (let i = 0; i < 2; i++) {
            assert.strictEqual(result, expected);
        }
    });

    test('it does not add extra spaces inside attribute content', async () => {
        const template = `<input type="text" class="my-class @error('form.title') has-error @enderror" />`
        const expected = `<input
    type="text"
    class="my-class @error("form.title") has-error @enderror"
/>
`;
        const output = await formatBladeString(template);


        assert.strictEqual(output, expected);
    });

    test('it doesnt duplicate or toggle between leading parenthesis', async () => {
        const template = `@php(($bg = get_field('populated_bg_color') === 'gray' ? ' bg-gray-100 my-2 my-lg-5' : ''))`,
            expected = `@php($bg = get_field("populated_bg_color") === "gray" ? " bg-gray-100 my-2 my-lg-5" : "")`;

        let out = await formatBladeString(template);

        assert.strictEqual(out.trim(), expected);

        for (let i = 0; i < 3; i++) {
            out = await formatBladeString(out);

            assert.strictEqual(out.trim(), expected);
        }

    });

    test('it doesnt consider invalid directives and cause impropper wrapping', async () => {
        const template = `

<div 
     @reply-deleted-{{ $comment->getKey() }}.window="
        doSomething()
     "
>
</div>

`;
        const expected = `<div
    @reply-deleted-{{ $comment->getKey() }}.window="
        doSomething()
     "
></div>
`;
        const out = await formatBladeString(template);

        assert.strictEqual(out, expected);
    });

    test('foreach with chained methods do not smoosh the as keyword', async () => {
        const input = `@foreach (collect()->where('foo', 'bar')->where('bar', 'foo') as $item)
<!-- -->
@endforeach`;
        const expected = `@foreach (collect()->where("foo", "bar")->where("bar", "foo") as $item)
    <!-- -->
@endforeach`;

        const out = await formatBladeString(input);

        assert.strictEqual(out.trim(), expected);
    });

    test('forelse with chained methods do not smoosh the as keyword', async () => {
        const input = `@forelse (collect($users)->one()->two()->take(3) as $user)
<li>{{ $user->name }}</li>
@empty
<p>No users</p>
@endforelse`;
        const expected = `@forelse (collect($users)->one()->two()->take(3) as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>No users</p>
@endforelse`;

        const out = await formatBladeString(input);

        assert.strictEqual(out.trim(), expected);
    });
});
