import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';
import { setupTestHooks } from './testUtils/formatting.js';

suite('Pint Transformer: If Statements', () => {
    setupTestHooks();

    test('pint: it can format if statements without any HTML hints', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@if($true)

@elseif($anotherValue)
@else

@endif


@if($true)
Thing
@elseif($anotherValue)
More Things
@else
Another Thing
@endif`)).trim(),
            `@if ($true)
@elseif ($anotherValue)
@else
@endif

@if ($true)
    Thing
@elseif ($anotherValue)
    More Things
@else
    Another Thing
@endif`
        );
    });

    test('pint: it can format if statements with embedded HTML', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@if($true)
<span>Hello</span>
@elseif($anotherValue)
<div>
    <p>Hello world</p>
    <div>
    @pair
        Test

@endpair
    </div>
    </div>
@else

<p>Test {{ $title}}     test
        </p>

@endif
`)).trim(),
            `@if ($true)
    <span>Hello</span>
@elseif ($anotherValue)
    <div>
        <p>Hello world</p>
        <div>
            @pair
                Test
            @endpair
        </div>
    </div>
@else
    <p>Test {{ $title }} test</p>
@endif`
        );
    });

    test('pint: it can parse and format conditions with lots of whitespace', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@if         ($true)
            <span>Hello</span>
            @elseif                     ($anotherValue)
            <div>
                <p>Hello world</p>
                <div>
                @pair
                    Test
            
            @endpair
                </div>
                </div>
            @else
            
            <p>Test {{ $title}}     test
                    </p>
            
            @endif`)).trim(),
            `@if ($true)
    <span>Hello</span>
@elseif ($anotherValue)
    <div>
        <p>Hello world</p>
        <div>
            @pair
                Test
            @endpair
        </div>
    </div>
@else
    <p>Test {{ $title }} test</p>
@endif`
        );
    });

    test('pint: simple if statement does not add extra indentation', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@if($true)
            <p>Hello
            </p>
            @endif`)).trim(),
            `@if ($true)
    <p>Hello</p>
@endif`
        );
    });

    test('pint: it can format nested if statements', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@if($true)
            Thing
        @elseif($anotherValue)
            More Things
        @else
            @if($true)
            Thing
        @elseif($anotherValue)
            More Things
        @else
            Another Thing
        @endif
        @endif`)).trim(),
            `@if ($true)
    Thing
@elseif ($anotherValue)
    More Things
@else
    @if ($true)
        Thing
    @elseif ($anotherValue)
        More Things
    @else
        Another Thing
    @endif
@endif`
        );
    });

    test('pint: it can format without an else', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@if($true)
            Thing
                        @elseif($anotherValue) More Things @endif`)).trim(),
            `@if ($true)
    Thing
@elseif ($anotherValue)
    More Things
@endif`
        );
    });

    test('pint: it indents child documents nicely if its just an echo', async () => {
        const template = `@if ('foo')
        {{ $actions }}
        @elseif ('bar')
        @endif
        `;
        const out = `@if ('foo')
    {{ $actions }}
@elseif ('bar')
@endif
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it preserves line placement inside conditions', async () => {
        const template=  `<div>
    @if (count($tenants = filament()->getUserTenants(filament()->auth()->user())))
    @endif
</div>`;
        const out = `<div>
    @if (count($tenants = filament()->getUserTenants(filament()->auth()->user())))
    @endif
</div>
`;

        assert.strictEqual(await formatBladeStringWithPint(template), out);
        assert.strictEqual(await formatBladeStringWithPint(out), out);
    });

    test('pint: it indents conditions in a sane way', async () => {
        const template = `<div>
        @if (count($tenants = filament()->getUserTenants(filament()->auth()->user()))
        )
        @endif
        </div>`;
        const out = `<div>
    @if (count($tenants = filament()->getUserTenants(filament()->auth()->user())))
    @endif
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
        assert.strictEqual(await formatBladeStringWithPint(out), out);
    });

    test('pint: it treats echos as text inside else blocks', async () => {
        const input = `@something('test') {{ $one }}
    @elsesomething('something else?') 
    {{ $two }} 
    @else
 {{ $three }}
@endsomething`;
        const out = `@something('test')
    {{ $one }}
@elsesomething('something else?')
    {{ $two }}
@else
    {{ $three }}
@endsomething
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
        assert.strictEqual(await formatBladeStringWithPint(out), out);
    });

    test('pint: it indents ifs containing only echos nicely', async () => {
        const input = `@if (true)
{{ 'foo' }}
{{ 'bar' }}
@else
{{ 'bar' }}
{{ 'baz' }}
@endif`;
        const output = `@if (true)
    {{ 'foo' }}
    {{ 'bar' }}
@else
    {{ 'bar' }}
    {{ 'baz' }}
@endif
`;
        assert.strictEqual(await formatBladeStringWithPint(input), output);
    });

    test('pint: it formats nicely if contains just components', async () => {
        const input = `
        @guest
            <x-foo></x-foo>
        @else
            <x-foo></x-foo>
        @endguest
        `;
        const output = `@guest
    <x-foo></x-foo>
@else
    <x-foo></x-foo>
@endguest
`;
        assert.strictEqual(await formatBladeStringWithPint(input), output);
    });

    test('pint: it formats nicely without any else block if just contains components', async () => {
        const input = `@if (filament()->hasRegistration())
<x-slot name="subheading">
    {{ __('filament::pages/auth/login.buttons.register.before') }}
    {{ $this->registerAction }}
</x-slot>
@endif`;
        const output = `@if (filament()->hasRegistration())
    <x-slot name="subheading">
        {{ __('filament::pages/auth/login.buttons.register.before') }}
        {{ $this->registerAction }}
    </x-slot>
@endif
`;
        assert.strictEqual(await formatBladeStringWithPint(input), output);
    });

    test('pint: layout engine detects different types of situations and formats nicely', async () => {
        const input = `

@if (true)
{{ 'foo' }}
{{ 'bar' }}
@else
{{ 'bar' }}
{{ 'baz' }}
@endif


@if (true)
{{ 'foo' }} {{ 'bar' }}
@else
{{ 'bar' }} {{ 'baz' }}
@endif

@if (true)
{{ 'foo' }} {{ 'bar' }}
@endif

@if (true)
{{ 'foo' }} {{ 'bar' }}
@else
A
@endif

@if (true)
A
@endif
`;
        const output = `@if (true)
    {{ 'foo' }}
    {{ 'bar' }}
@else
    {{ 'bar' }}
    {{ 'baz' }}
@endif

@if (true)
    {{ 'foo' }} {{ 'bar' }}
@else
    {{ 'bar' }} {{ 'baz' }}
@endif

@if (true)
    {{ 'foo' }} {{ 'bar' }}
@endif

@if (true)
    {{ 'foo' }} {{ 'bar' }}
@else
    A
@endif

@if (true)
    A
@endif
`;
        assert.strictEqual(await formatBladeStringWithPint(input), output);
        assert.strictEqual(await formatBladeStringWithPint(output), output);
    });

    test('pint: it can detect simple attached if statements to echos', async () => {
        const input = `@props([
    'error' => false,
    'isDisabled' => false,
    'isMarkedAsRequired' => true,
    'prefix' => null,
    'required' => false,
    'suffix' => null,
])

<label {{ $attributes->class(['filament-forms-field-wrapper-label inline-flex items-center space-x-3 rtl:space-x-reverse']) }}>
    {{ $prefix }}

    <span @class([
        'text-sm font-medium leading-4',
        'text-gray-700 dark:text-gray-300' => ! $error,
        'text-danger-700 dark:text-danger-400' => $error,
    ])>
        {{-- Deliberately poor formatting to ensure that the asterisk sticks to the final word in the label. --}}
        {{ $slot }}@if ($required && $isMarkedAsRequired && ! $isDisabled)<span class="whitespace-nowrap">
                <sup class="font-medium text-danger-700 dark:text-danger-400">*</sup>
            </span>
        @endif
    </span>

    {{ $suffix }}
</label>
`;
        const out = `@props([
    'error' => false,
    'isDisabled' => false,
    'isMarkedAsRequired' => true,
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
            'text-gray-700 dark:text-gray-300' => ! $error,
            'text-danger-700 dark:text-danger-400' => $error,
        ])
    >
        {{-- Deliberately poor formatting to ensure that the asterisk sticks to the final word in the label. --}}
        {{ $slot }}@if ($required && $isMarkedAsRequired && ! $isDisabled)<span class="whitespace-nowrap">
                <sup class="text-danger-700 dark:text-danger-400 font-medium">*</sup>
            </span>
        @endif
    </span>

    {{ $suffix }}
</label>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('void elements inside if statements', async () => {
        const input = `<div>
@if (true)
    <Link href="{{ route('profile.show') }}" class="text-sm text-gray-600 underline hover:text-gray-900">
        {{ __('Edit Profile') }}
    </Link>
@endif
</div>`;
        const output = `<div>
    @if (true)
        <Link
            href="{{ route('profile.show') }}"
            class="text-sm text-gray-600 underline hover:text-gray-900"
        >
            {{ __('Edit Profile') }}
        </Link>
    @endif
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), output);
    });
});