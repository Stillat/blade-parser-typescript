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
    @elsesomething ('something else?') 
    {{ $two }} 
    @else
 {{ $three }}
@endsomething`;
        const out = `@something ("test")
    {{ $one }}
@elsesomething ("something else?")
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
    {{ "foo" }} {{ "bar" }}
@else
    {{ "bar" }} {{ "baz" }}
@endif
`;
        assert.strictEqual(formatBladeString(input), output);
    });
});