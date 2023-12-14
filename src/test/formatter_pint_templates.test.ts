import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: General Templates', () => {
    test('pint: it can format strangely indented files', () => {
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

        <title>@yield('title', 'Default Title')</title>

        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet" />
    </head>
    <body>
        <header>
            @include('partials.nav')
        </header>

        <main>@yield('content')</main>

        <footer>
            @include('partials.footer')
        </footer>

        <!-- Scripts -->
        <script src="{{ asset('js/app.js') }}"></script>
    </body>
</html>
`
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });

    test('pint: it indents sections and content with ambiguous section start', () => {
        const template = `@extends('layouts.master')

@section('title', 'About Us')

@section('content')
<h1>About Us</h1>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis mauris mauris, id volutpat diam feugiat nec.</p>

@include('partials.team')
@endsection`;
        const out = `@extends('layouts.master')

@section('title', 'About Us')

@section('content')
    <h1>About Us</h1>

    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis
        mauris mauris, id volutpat diam feugiat nec.
    </p>

    @include('partials.team')
@endsection
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });

    test('pint: it indents sections conditions and loops', () => {
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
        const out = `@extends('layouts.master')

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
@endsection
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });

    test('pint: it indents form fields inside sections', () => {
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
        const out = `@extends('layouts.master')

@section('title', 'Contact Us')

@section('content')
    <h1>Contact Us</h1>

    <form method="POST" action="{{ route('contact.submit') }}">
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
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });

    test('pint: it indents nested loops', () => {
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
        const out = `@extends('layouts.master')

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
@endsection
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });

    test('pint: it indents nested conditions', () => {
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

        const out = `@extends('layouts.master')

@section('title', 'Dashboard')

@section('content')
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
            <a href="{{ route('login') }}">log in</a>
            to continue.
        </p>
    @endif
@endsection
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });
    
    test('pint: it indents conditions missing content', () => {
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
        const out = `@extends('layouts.master')

@section('title', 'Dashboard')

@section('content')
    <h1>Dashboard</h1>

    @if (Auth::check())
        @if (Auth::user()->isAdmin())
        @else
        @endif
    @else
    @endif
@endsection
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });

    test('pint: it indents switch statements', () => {
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
        const out = `@extends('layouts.master')

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
@endsection
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });

    test('pint: it does not eat email addresses', () => {
        let input = `someone@example.com`;
        assert.strictEqual(formatBladeStringWithPint(input).trim(), input);

        input = `<a 

        href="mailto:someone@example.com">@someone('.com')
            <p>Test</p>
        @endsomeone</a>`;
        
        const out = `<a href="mailto:someone@example.com">
    @someone('.com')
        <p>Test</p>
    @endsomeone
</a>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: it does not eat email addresses 2', () => {
        const template =  `<a>
        test@example.com
        </a>`;
        const expected = `<a>test@example.com</a>
`;
        assert.strictEqual(formatBladeStringWithPint(template), expected);
        assert.strictEqual(formatBladeStringWithPint(expected), expected);
    });

    test('pint: it preserves inline echos as text', () => {
        const input = `<span>
    {{ 'foo' }}:
</span>`;
        const output = `<span>{{ 'foo' }}:</span>
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);
        assert.strictEqual(formatBladeStringWithPint(output), output);
    });

    test('pint: it unwraps really long echos', () => {
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
        assert.strictEqual(formatBladeStringWithPint(template), output);
    });

    test('it does not continuously indent inside component attributes', () => {
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
        $isRoot ? ('if ($event.detail.livewireId !== '.Js::from($this->getId()).') {
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
        const f1 = formatBladeStringWithPint(input),
            f2 = formatBladeStringWithPint(f1),
            f3 = formatBladeStringWithPint(f2),
            f4 = formatBladeStringWithPint(f3);
        assert.strictEqual(f1, out);
        assert.strictEqual(f2, out);
        assert.strictEqual(f3, out);
        assert.strictEqual(f4, out);
    });
});