import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Directives Formatting', () => {
    test('it can format PHP in directives', () => {
        assert.strictEqual(
            formatBladeString(`@directive   ($test  + $that-$another   + $thing)`).trim(),
            `@directive($test + $that - $another + $thing)`
        );
    });

    test('it preserves content if PHP is invalid', () => {
        assert.strictEqual(
            formatBladeString(`@directive   ($test  ++++ $that-$another   + $thing)`).trim(),
            `@directive($test  ++++ $that-$another   + $thing)`
        );
    });

    test('it indents nicely', () => {
        assert.strictEqual(
            formatBladeString(`@section("messages")
    <div class="alert success">
        <p><strong>Success!</strong></p>
        @foreach ($success->all('<p>:message</p>') as $msg)
            {{ $msg }}
        @endforeach
    </div>
@show`).trim(),
            `@section("messages")
<div class="alert success">
    <p><strong>Success!</strong></p>
    @foreach($success->all('<p>:message</p>') as $msg)
        {{ $msg }}
    @endforeach
</div>
@show`
        );

        assert.strictEqual(
            formatBladeString(`
@section("messages")
<div class="alert success">
<p><strong>Success!</strong></p>
@foreach ($success->all('<p>:message</p>') as $msg)
{{ $msg }}
@endforeach
</div>
@show
`).trim(),
            `@section("messages")
<div class="alert success">
    <p><strong>Success!</strong></p>
    @foreach($success->all('<p>:message</p>') as $msg)
        {{ $msg }}
    @endforeach
</div>
@show`
        );
    });

    test('it indents if HTML is on separate lines', () => {
        assert.strictEqual(
            formatBladeString(`<div>
            @directive   ($test  + $that-$another   + $thing)
                </div>`).trim(),
            `<div>
    @directive($test + $that - $another + $thing)
</div>`
        );
    });

    test('it preserves same line if HTML is on same line', () => {
        assert.strictEqual(
            formatBladeString(`<div>@directive   ($test  + $that-$another   + $thing)</div>`).trim(),
            `<div>@directive($test + $that - $another + $thing)</div>`
        );
    });

    test('it can indent paired directives without any HTML hints', () => {
        assert.strictEqual(
            formatBladeString(`
<div>
    @pair
dasdfsdf
asdf
@endpair
            </div>`).trim(),
            `<div>
    @pair
        dasdfsdf asdf
    @endpair
</div>`
        );
    });

    test('it can indent paired directives with HTML', () => {
        assert.strictEqual(
            formatBladeString(`
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
            </div>`).trim(),
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

    test('virtual wrappers are not created for paired directives containing only inlined content', () => {
        const input = `
                @can('create', App\\Models\\User::class)
                {!! $something_here !!}
                @endcan
`;
        const out = `@can('create', App\\Models\\User::class)
    {!! $something_here !!}
@endcan
`;
        assert.strictEqual(formatBladeString(input), out);
    });
});
