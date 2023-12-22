import assert from 'assert';
import { formatBladeString, formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('If Statements', () => {
    test('it can format if statements without any HTML hints', async () => {
        assert.strictEqual(
            (await formatBladeString(`@if($true)

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

    test('it can format if statements with embedded HTML', async () => {
        assert.strictEqual(
            (await formatBladeString(`@if($true)
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

    test('it can parse and format conditions with lots of whitespace', async () => {
        assert.strictEqual(
            (await formatBladeString(`@if         ($true)
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

    test('simple if statement does not add extra indentation', async () => {
        assert.strictEqual(
            (await formatBladeString(`@if($true)
            <p>Hello
            </p>
            @endif`)).trim(),
            `@if ($true)
    <p>Hello</p>
@endif`
        );
    });

    test('it can format nested if statements', async () => {
        assert.strictEqual(
            (await formatBladeString(`@if($true)
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

    test('it can format without an else', async () => {
        assert.strictEqual(
            (await formatBladeString(`@if($true)
            Thing
                        @elseif($anotherValue) More Things @endif`)).trim(),
            `@if ($true)
    Thing
@elseif ($anotherValue)
    More Things
@endif`
        );
    });

    test('it indents child documents nicely if its just an echo', async () => {
        const template = `@if ('foo')
        {{ $actions }}
        @elseif ('bar')
        @endif
        `;
        const out = `@if ("foo")
    {{ $actions }}
@elseif ("bar")
@endif
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it preserves line placement inside conditions', async () => {
        const template=  `<div>
    @if (count($tenants = filament()->getUserTenants(filament()->auth()->user())))
    @endif
</div>`;
        const out = `<div>
    @if (count($tenants = filament()->getUserTenants(filament()->auth()->user())))
    @endif
</div>
`;

        assert.strictEqual(await formatBladeString(template), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it indents conditions in a sane way', async () => {
        const template = `<div>
        @if (count($tenants = filament()->getUserTenants(filament()->auth()->user()))
        )
        @endif
        </div>`;
        const out = `<div>
    @if (count(
        $tenants = filament()->getUserTenants(
            filament()
                ->auth()
                ->user()
        )
    ))
    @endif
</div>
`;
        assert.strictEqual(await formatBladeString(template), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it treats echos as text inside else blocks', async () => {
        const input = `@something('test') {{ $one }}
    @elsesomething('something else?') 
    {{ $two }} 
    @else
 {{ $three }}
@endsomething`;
        const out = `@something("test")
    {{ $one }}
@elsesomething("something else?")
    {{ $two }}
@else
    {{ $three }}
@endsomething
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it indents ifs containing only echos nicely', async () => {
        const input = `@if (true)
{{ 'foo' }}
{{ 'bar' }}
@else
{{ 'bar' }}
{{ 'baz' }}
@endif`;
        const output = `@if (true)
    {{ "foo" }}
    {{ "bar" }}
@else
    {{ "bar" }}
    {{ "baz" }}
@endif
`;
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('it formats nicely if contains just components', async () => {
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
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('it formats nicely without any else block if just contains components', async () => {
        const input = `@if (filament()->hasRegistration())
<x-slot name="subheading">
    {{ __('filament::pages/auth/login.buttons.register.before') }}
    {{ $this->registerAction }}
</x-slot>
@endif`;
        const output = `@if (filament()->hasRegistration())
    <x-slot name="subheading">
        {{ __("filament::pages/auth/login.buttons.register.before") }}
        {{ $this->registerAction }}
    </x-slot>
@endif
`;
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('layout engine detects different types of situations and formats nicely', async () => {
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
    {{ "foo" }}
    {{ "bar" }}
@else
    {{ "bar" }}
    {{ "baz" }}
@endif

@if (true)
    {{ "foo" }} {{ "bar" }}
@else
    {{ "bar" }} {{ "baz" }}
@endif

@if (true)
    {{ "foo" }} {{ "bar" }}
@endif

@if (true)
    {{ "foo" }} {{ "bar" }}
@else
    A
@endif

@if (true)
    A
@endif
`;
        assert.strictEqual(await formatBladeString(input), output);
        assert.strictEqual(await formatBladeString(output), output);
    });

    test('it positions literal content nicely', async () => {
        const input = `<div>
@if ($data['nextInspection'])
    <div
        class="text-gray inline-flex items-baseline text-base font-semibold"
    >
        @if ($data['nextInspection']->isToday())
                    Your inspection is today!
        @else
            <span class="mr-2 text-xs font-medium text-gray-700">
                {{ $data['nextInspection']->diffForhumans() }}
            </span>
            <span class="text-base font-semibold text-gray-900">
                {{ $data['nextInspection']->format('d.m.Y') }}
            </span>
        @endif
    </div>
@endif
</div>`;
        const out = `<div>
    @if ($data["nextInspection"])
        <div
            class="text-gray inline-flex items-baseline text-base font-semibold"
        >
            @if ($data["nextInspection"]->isToday())
                Your inspection is today!
            @else
                <span class="mr-2 text-xs font-medium text-gray-700">
                    {{ $data["nextInspection"]->diffForhumans() }}
                </span>
                <span class="text-base font-semibold text-gray-900">
                    {{ $data["nextInspection"]->format("d.m.Y") }}
                </span>
            @endif
        </div>
    @endif
</div>
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it places a space after conditions that appear before classes', async () => {
        const template = `<div class="@if($step === 1 || $step === 2 || $step === 3 ) bg-white @endif h-3 rounded-full border border-white"></div>`;
        const out = `<div
    class="@if($step === 1 || $step === 2 || $step === 3 ) bg-white @endif h-3 rounded-full border border-white"
></div>`;
        assert.strictEqual((await formatBladeStringWithPint(template)).trim(), out);
    });
});