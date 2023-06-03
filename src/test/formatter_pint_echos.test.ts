import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Echos', () => {
    test('pint: echo block: it formats valid PHP code', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{$test   +$that}}').trim(),
            '{{ $test + $that }}'
        );
    });

    test('pint: echo block: it formats valid PHP code in {!!', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{!!$test   +$that!!}').trim(),
            '{!! $test + $that !!}'
        );
    });

    test('pint: echo block: it formats valid PHP code in {{{', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{{$test   +$that}}}').trim(),
            '{{{ $test + $that }}}'
        );
    });

    test('pint: echo block: it ingores invalid PHP code', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{$test   $+++$that}}').trim(),
            '{{ $test   $+++$that }}'
        );
    });

    test('pint: echo block: it ignores invalid PHP code in {!!', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{!!$test   $+++$that!!}').trim(),
            '{!! $test   $+++$that !!}'
        );
    });

    test('pint: echo block: it formats php without crashing', () => {
        const input = `{{ str_pad($loop->index + 1, 2, '0', STR_PAD_LEFT) }}`;
        const out = `{{ str_pad($loop->index + 1, 2, '0', STR_PAD_LEFT) }}`;
        assert.strictEqual(formatBladeStringWithPint(input).trim(), out);
    });

    test('pint: echo block: it ignores invalid PHP code in {{{', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{{$test   $+++$that}}}').trim(),
            '{{{ $test   $+++$that }}}'
        );
    });

    test('pint: echo block: test formatting inline echo arrays does not add extra whitespace', () => {
        const input = `<a
href="#"
target="_blank"
{{ $attributes->merge(["class" => "rounded transition focus-visible:outline-none focus-visible:ring focus-visible:ring-red-600"]) }}
>
Some link
</a>`;
        const expected = `<a
    href="#"
    target="_blank"
    {{ $attributes->merge(['class' => 'rounded transition focus-visible:outline-none focus-visible:ring focus-visible:ring-red-600']) }}
>
    Some link
</a>`;
        assert.strictEqual(formatBladeStringWithPint(input).trim(), expected);
    });

    test('pint: echo block: it can format inline echos as text', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`
            <p>test {{ $title }} test
            
            asdfasdf </p>

            <p>{{ $test }}</p>`).trim(),
            `<p>test {{ $title }} test asdfasdf</p>

<p>{{ $test }}</p>`
        );
    });

    test('pint: echo block: it does not force wrap long echos', () => {
        const input = `{{ $attributes->class(["text-gray-900 border-gray-300 invalid:text-gray-400 block w-full h-9 py-1 transition duration-75 rounded-lg shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:border-primary-500"]) }}`;
        const out = `{{ $attributes->class(['focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 block h-9 w-full rounded-lg border-gray-300 py-1 text-gray-900 shadow-sm outline-none transition duration-75 invalid:text-gray-400 focus:ring-1 focus:ring-inset dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200']) }}`;
        assert.strictEqual(formatBladeStringWithPint(input).trim(), out);
    });

    test('pint: echo block: it respects echo line choices', () => {
        const input = `<label
{{
    $attributes
        ->whereDoesntStartWith('wire:model')
        ->class(['flex gap-3 text-sm'])
}}
>
</label>`;

        const out = `<label
    {{
        $attributes
            ->whereDoesntStartWith('wire:model')
            ->class(['flex gap-3 text-sm'])
    }}
></label>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: echo block: it respects line placement2', () => {
        const input = `<div>
{{
$foo->bar([
'foo' => $foo,
'bar' => $bar,
'baz' => $baz,
])
}}
</div>`;
        const out = `<div>
    {{
        $foo->bar([
            'foo' => $foo,
            'bar' => $bar,
            'baz' => $baz,
        ])
    }}
</div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
        assert.strictEqual(formatBladeStringWithPint(out), out);
    });

    test('pint: echo block: it respects line placement 3', () => {
        const input = `<div {{ $attributes->class([
            'some classes',
            match ($someCondition) {
                true => 'more classes foo bar baz',
                default => 'even more classes foo bar baz',
            },
        ]) }}>
        </div>`;
        const out = `<div
    {{
        $attributes->class([
            'some classes',
            match ($someCondition) {
                true => 'more classes foo bar baz',
                default => 'even more classes foo bar baz',
            },
        ])
    }}
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
        assert.strictEqual(formatBladeStringWithPint(out), out);
    });

    test('pint: echo block: it respects line placement 4', () => {
        const input = `<div {{ $attributes->class([
            'some classes',
            match ($someCondition) {
                true => 'more classes foo bar baz',
                default
                    => 'even more classes foo bar baz'
            },
        ]) }} more attributes class="one two three" something="else">
        </div>`;
        const out = `<div
    {{
        $attributes->class([
            'some classes',
            match ($someCondition) {
                true => 'more classes foo bar baz',
                default => 'even more classes foo bar baz'
            },
        ])
    }}
    more
    attributes
    class="one two three"
    something="else"
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
        assert.strictEqual(formatBladeStringWithPint(out), out);
    });

    test('pint: echo block: it preserves trailing comma on match', () => {
        const template = `<div
{{
    match ($foo) {
        'foo' => 'foo',
        default => 'bar',
    }
}}
></div>`;
        const out = `<div
    {{
        match ($foo) {
            'foo' => 'foo',
            default => 'bar',
        }
    }}
></div>`;
        assert.strictEqual(formatBladeStringWithPint(template).trim(), out);
    });

    test('pint: echo block: it respects line placement when blocking echos', () => {
        const input = `<form wire:submit.prevent="authenticate" class="grid gap-y-8">
{{ $this->form }}

{{ $this->authenticateAction }}
</form>`;
        const output = `<form wire:submit.prevent="authenticate" class="grid gap-y-8">
    {{ $this->form }}

    {{ $this->authenticateAction }}
</form>
`;
        assert.strictEqual(formatBladeStringWithPint(input), output);
    });

    test('pint: echo block: it inlines adjacent echos', () => {
        const input = `<div>
    {{ $foo }}{{ $bar }}
</div>`;
        const out = `<div>{{ $foo }}{{ $bar }}</div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('pint: echo block: it can format really long lines', () => {
        const input = `
<div>
{{
$foo->bar([
'foo' => $foo,
'bar' => $bar,
'baz' => $baz,
])
}}
</div>
<div
    {{
        $attributes->class([
             'foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo oo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo f',
             'bar',
        ])
    }}
></div>
`;
        const expected = `<div>
    {{
        $foo->bar([
            'foo' => $foo,
            'bar' => $bar,
            'baz' => $baz,
        ])
    }}
</div>
<div
    {{
        $attributes->class([
            'foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo oo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo f',
            'bar',
        ])
    }}
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), expected);
        assert.strictEqual(formatBladeStringWithPint(expected), expected);
    });

    test('pint: it works around missing space on certain pint input', () => {
        const input = `
{{
    $foo
        ->bar()
}}
@php
@endphp
C
<div>
    {{
        $foo
            ->bar()
    }}
</div>
D
@php
    /**
    * @deprecated Override \`logo.blade.php\` instead.
    */
@endphp
E
`;
        const expected = `{{
    $foo
        ->bar()
}}
@php
@endphp

C
<div>
    {{
        $foo
            ->bar()
    }}
</div>
D
@php
    /**
    * @deprecated Override \`logo.blade.php\` instead.
    */
@endphp
E
`;
        assert.strictEqual(formatBladeStringWithPint(input), expected);
        // Run it twice to ensure we don't introduce a double-indentation issue.
        assert.strictEqual(formatBladeStringWithPint(expected), expected);
    });

    test('pint: it uses consistent indentation', () => {
        const input = `@php
$foo = 'foo';
@endphp

<div
{{
    $attributes->class([
       'foo',
       'bar',
    ])
}}
></div>`;
        const expected = `@php
    $foo = 'foo';
@endphp

<div {{
    $attributes->class([
        'foo',
        'bar',
    ])
}}></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), expected);
    });

    test('pint: it does not do dumb things when there are php nodes too', () => {
        const input = `
@php
    $foo = 'foo';
    $bar = 'bar';
@endphp

<div
    {{
        $attributes->class([
           'foo',
           'bar',
        ])
    }}
></div>
`;
        const out = `@php
    $foo = 'foo';
    $bar = 'bar';
@endphp

<div
    {{
        $attributes->class([
            'foo',
            'bar',
        ])
    }}
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
        assert.strictEqual(formatBladeStringWithPint(out), out);
    });

    
    test('pint: it does not do dumb things when there are php nodes too #2', () => {
        const input = `
@php
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $bar = 'bar';
@endphp


<div
    {{
        $attributes->class([
           'foo',
           'bar',
        ])
    }}
></div>

@php
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $bar = 'bar';

    $iconClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-button-icon',
        'w-4 h-4' => $size === 'sm',
        'w-5 h-5' => $size === 'md',
        'w-6 h-6' => $size === 'lg',
        'mr-1 -ml-2 rtl:ml-1 rtl:-mr-2' => ($iconPosition === 'before') && ($size === 'md') && (! $labelSrOnly),
        'mr-2 -ml-3 rtl:ml-2 rtl:-mr-3' => ($iconPosition === 'before') && ($size === 'lg') && (! $labelSrOnly),
        'mr-1 -ml-1.5 rtl:ml-1 rtl:-mr-1.5' => ($iconPosition === 'before') && ($size === 'sm') && (! $labelSrOnly),
        'ml-1 -mr-2 rtl:mr-1 rtl:-ml-2' => ($iconPosition === 'after') && ($size === 'md') && (! $labelSrOnly),
        'ml-2 -mr-3 rtl:mr-2 rtl:-ml-3' => ($iconPosition === 'after') && ($size === 'lg') && (! $labelSrOnly),
        'ml-1 -mr-1.5 rtl:mr-1 rtl:-ml-1.5' => ($iconPosition === 'after') && ($size === 'sm') && (! $labelSrOnly),
    ]);
@endphp



<div
    {{
        $attributes->class([
           'foo',
           'bar',
        ])
    }}
></div>


<div
    {{
        $attributes->class([
           'foo',
           'bar',
        ])
    }}
></div>

<div
    {{
        $attributes->class([
           'foo',
           'bar',
        ])
    }}
></div>
`;
        const out = `@php
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $bar = 'bar';
@endphp

<div
    {{
        $attributes->class([
            'foo',
            'bar',
        ])
    }}
></div>

@php
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $foo = 'foo';
    $bar = 'bar';

    $iconClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'filament-button-icon',
        'w-4 h-4' => $size === 'sm',
        'w-5 h-5' => $size === 'md',
        'w-6 h-6' => $size === 'lg',
        'mr-1 -ml-2 rtl:ml-1 rtl:-mr-2' => ($iconPosition === 'before') && ($size === 'md') && (! $labelSrOnly),
        'mr-2 -ml-3 rtl:ml-2 rtl:-mr-3' => ($iconPosition === 'before') && ($size === 'lg') && (! $labelSrOnly),
        'mr-1 -ml-1.5 rtl:ml-1 rtl:-mr-1.5' => ($iconPosition === 'before') && ($size === 'sm') && (! $labelSrOnly),
        'ml-1 -mr-2 rtl:mr-1 rtl:-ml-2' => ($iconPosition === 'after') && ($size === 'md') && (! $labelSrOnly),
        'ml-2 -mr-3 rtl:mr-2 rtl:-ml-3' => ($iconPosition === 'after') && ($size === 'lg') && (! $labelSrOnly),
        'ml-1 -mr-1.5 rtl:mr-1 rtl:-ml-1.5' => ($iconPosition === 'after') && ($size === 'sm') && (! $labelSrOnly),
    ]);
@endphp

<div
    {{
        $attributes->class([
            'foo',
            'bar',
        ])
    }}
></div>

<div
    {{
        $attributes->class([
            'foo',
            'bar',
        ])
    }}
></div>

<div
    {{
        $attributes->class([
            'foo',
            'bar',
        ])
    }}
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
        assert.strictEqual(formatBladeStringWithPint(out), out);
    }).timeout(5000);
});