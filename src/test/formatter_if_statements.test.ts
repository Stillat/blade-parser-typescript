import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('If Statements', () => {
    test('it can format if statements without any HTML hints', () => {
        assert.strictEqual(
            formatBladeString(`@if($true)

@elseif($anotherValue)
@else

@endif


@if($true)
Thing
@elseif($anotherValue)
More Things
@else
Another Thing
@endif`).trim(),
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

    test('it can format if statements with embedded HTML', () => {
        assert.strictEqual(
            formatBladeString(`@if($true)
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
`).trim(),
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

    test('it can parse and format conditions with lots of whitespace', () => {
        assert.strictEqual(
            formatBladeString(`@if         ($true)
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
            
            @endif`).trim(),
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

    test('simple if statement does not add extra indentation', () => {
        assert.strictEqual(
            formatBladeString(`@if($true)
            <p>Hello
            </p>
            @endif`).trim(),
            `@if ($true)
    <p>Hello</p>
@endif`
        );
    });

    test('it can format nested if statements', () => {
        assert.strictEqual(
            formatBladeString(`@if($true)
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
        @endif`).trim(),
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

    test('it can format without an else', () => {
        assert.strictEqual(
            formatBladeString(`@if($true)
            Thing
                        @elseif($anotherValue) More Things @endif`).trim(),
            `@if ($true)
    Thing
@elseif ($anotherValue)
    More Things
@endif`
        );
    });

    test('it indents child documents nicely if its just an echo', () => {
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
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it preserves line placement inside conditions', () => {
        const template=  `<div>
    @if (count($tenants = filament()->getUserTenants(filament()->auth()->user())))
    @endif
</div>`;
        const out = `<div>
    @if (count($tenants = filament()->getUserTenants(filament()->auth()->user())))
    @endif
</div>
`;

        assert.strictEqual(formatBladeString(template), out);
        assert.strictEqual(formatBladeString(out), out);
    });

    test('it indents conditions in a sane way', () => {
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
        assert.strictEqual(formatBladeString(template), out);
        assert.strictEqual(formatBladeString(out), out);
    });

    test('it treats echos as text inside else blocks', () => {
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
        assert.strictEqual(formatBladeString(input), out);
        assert.strictEqual(formatBladeString(out), out);
    });

    test('it indents ifs containing only echos nicely', () => {
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
        assert.strictEqual(formatBladeString(input), output);
    });

    test('it formats nicely if contains just components', () => {
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
        assert.strictEqual(formatBladeString(input), output);
    });

    test('it formats nicely without any else block if just contains components', () => {
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
        assert.strictEqual(formatBladeString(input), output);
    });

    test('layout engine detects different types of situations and formats nicely', () => {
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
        assert.strictEqual(formatBladeString(input), output);
        assert.strictEqual(formatBladeString(output), output);
    });

    test('it positions literal content nicely', () => {
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
        assert.strictEqual(formatBladeString(input), out);
    });
});