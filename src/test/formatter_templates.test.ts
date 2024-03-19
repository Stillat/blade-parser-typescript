import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('General Template Formatting', () => {
    test('it can format strangely indented files', async () => {
        const template = `<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title', 'Default Title')</title>
        
        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    </head>
                    <body>
                        <header>
                            @include('partials.nav')
                        </header>

                        <main> @yield('content')
</main>

                        <footer>
                            @include('partials.footer')
                    </footer>

                    <!-- Scripts -->
<script src="{{ asset('js/app.js') }}"></script>
                    </body>
                </html>
`; 
        const out = `<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>@yield("title", "Default Title")</title>

        <!-- Styles -->
        <link href="{{ asset("css/app.css") }}" rel="stylesheet" />
    </head>
    <body>
        <header>
            @include("partials.nav")
        </header>

        <main>@yield("content")</main>

        <footer>
            @include("partials.footer")
        </footer>

        <!-- Scripts -->
        <script src="{{ asset("js/app.js") }}"></script>
    </body>
</html>
`
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it indents sections and content with ambiguous section start', async () => {
        const template = `@extends('layouts.master')

@section('title', 'About Us')

@section('content')
<h1>About Us</h1>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis mauris mauris, id volutpat diam feugiat nec.</p>

@include('partials.team')
@endsection`;
        const out = `@extends("layouts.master")

@section("title", "About Us")

@section("content")
    <h1>About Us</h1>

    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis
        mauris mauris, id volutpat diam feugiat nec.
    </p>

    @include("partials.team")
@endsection
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it indents sections conditions and loops', async () => {
        const template = `@extends('layouts.master')

@section('title', 'User List')

@section('content')
<h1>User List</h1>

@if ($users->isEmpty())
<p>No users found.</p>
@else
<ul>
@foreach ($users as $user)
<li>{{ $user->name }} - {{ $user->email }}</li>
@endforeach
</ul>
@endif
@endsection`;
        const out = `@extends("layouts.master")

@section("title", "User List")

@section("content")
    <h1>User List</h1>

    @if ($users->isEmpty())
        <p>No users found.</p>
    @else
        <ul>
            @foreach ($users as $user)
                <li>{{ $user->name }} - {{ $user->email }}</li>
            @endforeach
        </ul>
    @endif
@endsection
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it indents form fields inside sections', async () => {
        const template = `@extends('layouts.master')

@section('title', 'Contact Us')

@section('content')
<h1>Contact Us</h1>

<form method="POST" action="{{ route('contact.submit') }}">
@csrf

<label for="name">Name</label>
<input type="text" id="name" name="name">

<label for="email">Email</label>
<input type="email" id="email" name="email">

<label for="message">Message</label>
<textarea id="message" name="message"></textarea>

<button type="submit">Send</button>
</form>
@endsection`
        const out = `@extends("layouts.master")

@section("title", "Contact Us")

@section("content")
    <h1>Contact Us</h1>

    <form method="POST" action="{{ route("contact.submit") }}">
        @csrf

        <label for="name">Name</label>
        <input type="text" id="name" name="name" />

        <label for="email">Email</label>
        <input type="email" id="email" name="email" />

        <label for="message">Message</label>
        <textarea id="message" name="message"></textarea>

        <button type="submit">Send</button>
    </form>
@endsection
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it indents nested loops', async () => {
        const template = `@extends('layouts.master')

@section('title', 'Product Categories')

@section('content')
<h1>Product Categories</h1>

@foreach ($categories as $category)
<h2>{{ $category->name }}</h2>

@if ($category->products->isEmpty())
<p>No products in this category.</p>
@else
<ul>
@foreach ($category->products as $product)
<li>{{ $product->name }} - \${{ $product->price }}</li>
@endforeach
</ul>
@endif
@endforeach
@endsection`;
        const out = `@extends("layouts.master")

@section("title", "Product Categories")

@section("content")
    <h1>Product Categories</h1>

    @foreach ($categories as $category)
        <h2>{{ $category->name }}</h2>

        @if ($category->products->isEmpty())
            <p>No products in this category.</p>
        @else
            <ul>
                @foreach ($category->products as $product)
                    <li>{{ $product->name }} - \${{ $product->price }}</li>
                @endforeach
            </ul>
        @endif
    @endforeach
@endsection
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it indents nested conditions', async () => {
        const template = `@extends('layouts.master')

@section('title', 'Dashboard')

@section('content')
<h1>Dashboard</h1>

@if (Auth::check())
<p>Welcome back, {{ Auth::user()->name }}!</p>

@if (Auth::user()->isAdmin())
<p>You have <a href="">admin</a> privileges.</p>
@else
<p>You are a regular user.</p>
@endif
@else
<p>Please <a href="{{ route('login') }}">log in</a> to continue.</p>
@endif
@endsection`;

        const out = `@extends("layouts.master")

@section("title", "Dashboard")

@section("content")
    <h1>Dashboard</h1>

    @if (Auth::check())
        <p>Welcome back, {{ Auth::user()->name }}!</p>

        @if (Auth::user()->isAdmin())
            <p>
                You have
                <a href="">admin</a>
                privileges.
            </p>
        @else
            <p>You are a regular user.</p>
        @endif
    @else
        <p>
            Please
            <a href="{{ route("login") }}">log in</a>
            to continue.
        </p>
    @endif
@endsection
`;
        assert.strictEqual(await formatBladeString(template), out);
    });
    
    test('it indents conditions missing content', async () => {
        const template = `@extends('layouts.master')

        @section('title', 'Dashboard')
        
        @section('content')
        <h1>Dashboard</h1>
        
        @if(Auth::check())
        
        @if (Auth::user()->isAdmin())
        @else
        @endif
        @else
                                                @endif
        @endsection`;
        const out = `@extends("layouts.master")

@section("title", "Dashboard")

@section("content")
    <h1>Dashboard</h1>

    @if (Auth::check())
        @if (Auth::user()->isAdmin())
        @else
        @endif
    @else
    @endif
@endsection
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it indents switch statements', async () => {
        const template = `@extends('layouts.master')

        @section('title', 'Notification')
        
        @section('content')
        <h1>Notification</h1>
        
        @switch($notification->type)
        @case('message')
        <p>You have a new message from {{ $notification->from }}.</p>
        @break
        
        @case('alert')
        <p>Alert: {{ $notification->message }}</p>
        @break
        
        @case('reminder')
        <p>Reminder: {{ $notification->message }}</p>
        @break
        
        @default
        <p>You have a new notification.</p>
        @endswitch
        @endsection`
        const out = `@extends("layouts.master")

@section("title", "Notification")

@section("content")
    <h1>Notification</h1>

    @switch($notification->type)
        @case("message")
            <p>You have a new message from {{ $notification->from }}.</p>

            @break
        @case("alert")
            <p>Alert: {{ $notification->message }}</p>

            @break
        @case("reminder")
            <p>Reminder: {{ $notification->message }}</p>

            @break
        @default
            <p>You have a new notification.</p>
    @endswitch
@endsection
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it does not eat email addresses', async () => {
        let input = `someone@example.com`;
        assert.strictEqual((await formatBladeString(input)).trim(), input);

        input = `<a 

        href="mailto:someone@example.com">@someone('.com')
            <p>Test</p>
        @endsomeone</a>`;
        
        const out = `<a href="mailto:someone@example.com">
    @someone(".com")
        <p>Test</p>
    @endsomeone
</a>
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it does not eat email addresses 2', async () => {
        const template =  `<a>
        test@example.com
        </a>`;
        const expected = `<a>test@example.com</a>
`;
        assert.strictEqual(await formatBladeString(template), expected);
        assert.strictEqual(await formatBladeString(expected), expected);
    });

    test('it preserves inline echos as text', async () => {
        const input = `<span>
    {{ 'foo' }}:
</span>`;
        const output = `<span>{{ "foo" }}:</span>
`;
        assert.strictEqual(await formatBladeString(input), output);
        assert.strictEqual(await formatBladeString(output), output);
    });

    test('it unwraps really long echos', async () => {
        const template = `                  <div><div><div>  <x-something::component-name.here :action="$hintAction" :color="$hintColor" :icon="$hintIcon">
        {{ filled($hint) ? ($hint instanceof \\Illuminate\\Support\\HtmlString ? $hint : \\Illuminate\\Support\\Str::of($hint)->markdown()->sanitizeHtml()->toHtmlString()) : null }}
        </x-something::component-name.here></div></div></div>`;
        const output = `<div>
    <div>
        <div>
            <x-something::component-name.here
                :action="$hintAction"
                :color="$hintColor"
                :icon="$hintIcon"
            >
                {{ filled($hint) ? ($hint instanceof \\Illuminate\\Support\\HtmlString ? $hint : \\Illuminate\\Support\\Str::of($hint)->markdown()->sanitizeHtml()->toHtmlString()) : null }}
            </x-something::component-name.here>
        </div>
    </div>
</div>
`;
        assert.strictEqual(await formatBladeString(template), output);
    });

    test('it formats email addresses inside simple if statements', async () => {
        const template = `
@if (true)
test@example.com
@endif

`;
        const expected = `@if (true)
    test@example.com
@endif
`;
        assert.strictEqual(await formatBladeString(template), expected);
    });

    test('excessive indentation is not added when not using pint', async () => {
        const input = `
<x-filament::grid
    :x-on:form-validation-error.window="
        $isRoot ? ('if ($event.detail.livewireId !== ' . Js::from($this->getId()) . ') {
            return
        }

        $nextTick(() => {
            error = $el.querySelector(\\'[data-validation-error]\\')

            if (! error) {
                return
            }

            elementToExpand = error

            while (elementToExpand) {
                elementToExpand.dispatchEvent(new CustomEvent(\\'expand\\'))

                elementToExpand = elementToExpand.parentNode
            }

            setTimeout(
                () =>
                    error.closest(\\'[data-field-wrapper]\\').scrollIntoView({
                        behavior: \\'smooth\\',
                        block: \\'start\\',
                        inline: \\'start\\',
                    }),
                200,
            )
        })') : null
    "
>
    {{-- --}}
</x-filament::grid>

`;
        const out = `<x-filament::grid
    :x-on:form-validation-error.window="
        $isRoot ? ('if ($event.detail.livewireId !== ' . Js::from($this->getId()) . ') {
            return
        }

        $nextTick(() => {
            error = $el.querySelector(\\'[data-validation-error]\\')

            if (! error) {
                return
            }

            elementToExpand = error

            while (elementToExpand) {
                elementToExpand.dispatchEvent(new CustomEvent(\\'expand\\'))

                elementToExpand = elementToExpand.parentNode
            }

            setTimeout(
                () =>
                    error.closest(\\'[data-field-wrapper]\\').scrollIntoView({
                        behavior: \\'smooth\\',
                        block: \\'start\\',
                        inline: \\'start\\',
                    }),
                200,
            )
        })') : null
    "
>
    {{--  --}}
</x-filament::grid>
`;
        const f1 = await formatBladeString(input),
            f2 = await formatBladeString(f1);

        assert.strictEqual(f1, out);
        assert.strictEqual(f2, out);
    });

    test('it does not excessively indent component attributes #96', async () => {
        const input = `@section('content')
    <x-tw::page-header :breadcrumbs="[
            [
                'title' => 'Shortener',
            ],
    ]" />
@endsection`;
        const expected = `@section("content")
    <x-tw::page-header
        :breadcrumbs="[
            [
                'title' => 'Shortener',
            ],
        ]"
    />
@endsection
`;
        let out = await formatBladeString(input);
        assert.strictEqual(out, expected);

        for (let i = 0; i < 5; i++) {
            out = await formatBladeString(out);

            assert.strictEqual(out, expected);
        }
    });
});