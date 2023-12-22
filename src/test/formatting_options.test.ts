import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';
import { defaultSettings } from '../formatting/optionDiscovery.js';

suite('Formatting Options', () => {
    test('formatting inside echos can be disabled', async () => {
        const template = `{{ ! $foo }}`;

        assert.strictEqual((await formatBladeString(template, {
                ...defaultSettings,
                formatInsideEcho: false
            })).trim(), template);
    });

    test('formatting of directive args can be disabled', async () => {
        const template = `@class([
    'foo' => true
])`;
        assert.strictEqual((await formatBladeString(template, {
                ...defaultSettings,
                formatDirectivePhpParameters: false,
            })).trim(), template);
    });

    test('formatting props args can be disabled', async () => {
        let template = `@props([
    'foo' => [],
])`;
        assert.strictEqual((await formatBladeString(template, {
                ...defaultSettings,
                formatDirectivePhpParameters: false,
            })).trim(), template);

        template = `@props([
    'some' => null,
    'property' => null,
])`;
        assert.strictEqual((await formatBladeString(template, {
                ...defaultSettings,
                formatDirectivePhpParameters: false,
            })).trim(), template);
    });

    test('it continues to format the document even with certain things disabled', async () => {
        // Note: the spacing on 'foo4' is intentional.
        const template = `@extends('layouts.master')

@props([
    'foo' => [],
    'foo1' => [],
    'foo2' => [],
    'foo3' => [],
    'foo4'      => [],
    'foo5' => [],
    'foo6' => [],
    'foo7' => [
        'foo' => [],
        'foo1' => [],
        'foo2' => [],
        'foo3' => [],
        'foo4' => [],
        'foo5' => [],
        'foo6' => [],
        'foo7' => [],
    ],
])

@section('title', 'Dashboard')

<div @class([
    'foo' => true
])>
    Something
</div>

@section('content')
<h1>Dashboard</h1>

@if(Auth::check())
<p>Welcome back, {{ Auth::user()->name }}!</p>

@if(Auth::user()->isAdmin())
<p>You have <a href="">admin</a> privileges.</p>
@else
<p>You are a regular user.</p>
@endif
@else
<p>Please <a href="{{ route('login') }}">log in</a> to continue.</p>
@endif
@endsection`;
        const out = `@extends('layouts.master')

@props([
    'foo' => [],
    'foo1' => [],
    'foo2' => [],
    'foo3' => [],
    'foo4'      => [],
    'foo5' => [],
    'foo6' => [],
    'foo7' => [
        'foo' => [],
        'foo1' => [],
        'foo2' => [],
        'foo3' => [],
        'foo4' => [],
        'foo5' => [],
        'foo6' => [],
        'foo7' => [],
    ],
])

@section('title', 'Dashboard')

<div @class([
    'foo' => true
])>Something</div>

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
        assert.strictEqual(await formatBladeString(template, {
            ...defaultSettings,
            formatInsideEcho: false,
            formatDirectivePhpParameters: false,
        }), out);
    });

    test('custom prettier options can be set', async () => {
        const input = `{{
    someFunction(
        "foobarbaz",
        "barbazfoo",
        "baz",
    )
}}
`;
        const output = `{{
    someFunction(
        'foobarbaz',
        'barbazfoo',
        'baz',
    )
}}
`
        assert.strictEqual(await formatBladeString(input, {
    ...defaultSettings,
    phpOptions: {
        singleQuote: true,
        phpVersion: "8.0"
    }
}), output);

const output2 = `{{
    someFunction(
        "foobarbaz",
        "barbazfoo",
        "baz",
    )
}}
`
        // PHP 8 should now be the default.
        assert.strictEqual(await formatBladeString(input), output2);
    });
});