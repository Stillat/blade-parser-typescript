import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('General Template Formatting', () => {
    test('it can format strangely indented files', () => {
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
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it indents sections and content with ambiguous section start', () => {
        const template = `@extends('layouts.master')

@section('title', 'About Us')

@section('content')
<h1>About Us</h1>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis mauris mauris, id volutpat diam feugiat nec.</p>

@include('partials.team')
@endsection`;
        const out = `@extends("layouts.master")

@section('title', 'About Us')

@section("content")
    <h1>About Us</h1>

    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis
        mauris mauris, id volutpat diam feugiat nec.
    </p>

    @include("partials.team")
@endsection
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it indents sections conditions and loops', () => {
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

@section('title', 'User List')

@section("content")
    <h1>User List</h1>

    @if($users->isEmpty())
        <p>No users found.</p>
    @else
        <ul>
            @foreach($users as $user)
                <li>{{ $user->name }} - {{ $user->email }}</li>
            @endforeach
        </ul>
    @endif
@endsection
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it indents form fields inside sections', () => {
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

@section('title', 'Contact Us')

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
        assert.strictEqual(formatBladeString(template), out);
    });
});