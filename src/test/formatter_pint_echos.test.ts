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
        const out = `{{ $attributes->class(['text-gray-900 border-gray-300 invalid:text-gray-400 block w-full h-9 py-1 transition duration-75 rounded-lg shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:border-primary-500']) }}`;
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
    })
});