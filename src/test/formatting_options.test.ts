import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';
import { defaultSettings } from '../formatting/optionDiscovery';

suite('Formatting Options', () => {
    test('formatting inside echos can be disabled', () => {
        const template = `{{ ! $foo }}`;

        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatInsideEcho: false
        }).trim(), template);
    });

    test('formatting of directive args can be disabled', () => {
        const template = `@class([
    'foo' => true
])`;
        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatDirectivePhpParameters: false,
        }).trim(), template);
    });

    test('formatting props args can be disabled', () => {
        let template = `@props([
    'foo' => [],
])`;
        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatDirectivePhpParameters: false,
        }).trim(), template);

        template = `@props([
    'some' => null,
    'property' => null,
])`;
        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatDirectivePhpParameters: false,
        }).trim(), template);
    });

    test('it continues to format the document even with certain things disabled', () => {
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
        assert.strictEqual(formatBladeString(template, {
            ...defaultSettings,
            formatInsideEcho: false,
            formatDirectivePhpParameters: false,
        }), out);
    });
});