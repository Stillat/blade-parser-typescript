import assert from 'assert';
import { formatBladeString, formatBladeStringWithPint } from '../formatting/prettier/utils.js';
import { setupTestHooks } from './testUtils/formatting.js';

suite('Echo Formatting', () => {
    setupTestHooks();

    test('it formats valid PHP code', async () => {
        assert.strictEqual(
            (await formatBladeString('{{$test   +$that}}')).trim(),
            '{{ $test + $that }}'
        );
    });

    test('it formats valid PHP code in {!!', async () => {
        assert.strictEqual(
            (await formatBladeString('{!!$test   +$that!!}')).trim(),
            '{!! $test + $that !!}'
        );
    });

    test('it formats valid PHP code in {{{', async () => {
        assert.strictEqual(
            (await formatBladeString('{{{$test   +$that}}}')).trim(),
            '{{{ $test + $that }}}'
        );
    });

    test('it ingores invalid PHP code', async () => {
        assert.strictEqual(
            (await formatBladeString('{{$test   $+++$that}}')).trim(),
            '{{ $test   $+++$that }}'
        );
    });

    test('it ignores invalid PHP code in {!!', async () => {
        assert.strictEqual(
            (await formatBladeString('{!!$test   $+++$that!!}')).trim(),
            '{!! $test   $+++$that !!}'
        );
    });

    test('it formats php without crashing', async () => {
        const input = `{{ str_pad($loop->index + 1, 2, '0', STR_PAD_LEFT) }}`;
        const out = `{{ str_pad($loop->index + 1, 2, "0", STR_PAD_LEFT) }}`;
        assert.strictEqual((await formatBladeString(input)).trim(), out);
    });

    test('it ignores invalid PHP code in {{{', async () => {
        assert.strictEqual(
            (await formatBladeString('{{{$test   $+++$that}}}')).trim(),
            '{{{ $test   $+++$that }}}'
        );
    });

    test('test formatting inline echo arrays does not add extra whitespace', async () => {
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
    {{ $attributes->merge(["class" => "rounded transition focus-visible:outline-none focus-visible:ring focus-visible:ring-red-600"]) }}
>
    Some link
</a>`;
        assert.strictEqual((await formatBladeString(input)).trim(), expected);
    });

    test('it can format inline echos as text', async () => {
        assert.strictEqual(
            (await formatBladeString(`
            <p>test {{ $title }} test
            
            asdfasdf </p>

            <p>{{ $test }}</p>`)).trim(),
            `<p>test {{ $title }} test asdfasdf</p>

<p>{{ $test }}</p>`
        );
    });

    test('it does not force wrap long echos', async () => {
        const input = `{{ $attributes->class(["text-gray-900 border-gray-300 invalid:text-gray-400 block w-full h-9 py-1 transition duration-75 rounded-lg shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:border-primary-500"]) }}`;
        const out = `{{ $attributes->class(["focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 block h-9 w-full rounded-lg border-gray-300 py-1 text-gray-900 shadow-sm outline-none transition duration-75 invalid:text-gray-400 focus:ring-1 focus:ring-inset dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"]) }}`;
        assert.strictEqual((await formatBladeString(input)).trim(), out);
    });

    test('it respects echo line choices', async () => {
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
            ->whereDoesntStartWith("wire:model")
            ->class(["flex gap-3 text-sm"])
    }}
></label>
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it respects line placement2', async () => {
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
            "foo" => $foo,
            "bar" => $bar,
            "baz" => $baz,
        ])
    }}
</div>
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it respects line placement 3', async () => {
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
            "some classes",
            match ($someCondition) {
                true => "more classes foo bar baz",
                default => "even more classes foo bar baz",
            },
        ])
    }}
></div>
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it respects line placement 4', async () => {
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
            "some classes",
            match ($someCondition) {
                true => "more classes foo bar baz",
                default => "even more classes foo bar baz",
            },
        ])
    }}
    more
    attributes
    class="one two three"
    something="else"
></div>
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it preserves trailing comma on match', async () => {
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
            "foo" => "foo",
            default => "bar",
        }
    }}
></div>`;
        assert.strictEqual((await formatBladeString(template)).trim(), out);
    });

    test('it respects line placement when blocking echos', async () => {
        const input = `<form wire:submit.prevent="authenticate" class="grid gap-y-8">
{{ $this->form }}

{{ $this->authenticateAction }}
</form>`;
        const output = `<form wire:submit.prevent="authenticate" class="grid gap-y-8">
    {{ $this->form }}

    {{ $this->authenticateAction }}
</form>
`;
        assert.strictEqual(await formatBladeString(input), output);
    });

    test('it inlines adjacent echos', async () => {
        const input = `<div>
    {{ $foo }}{{ $bar }}
</div>`;
        const out = `<div>{{ $foo }}{{ $bar }}</div>
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it can workaround dumb prettier opinions', async () => {
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
            "foo" => $foo,
            "bar" => $bar,
            "baz" => $baz,
        ])
    }}
</div>
<div
    {{
        $attributes->class([
            "foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo oo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo f",
            "bar",
        ])
    }}
></div>
`;
        assert.strictEqual(await formatBladeString(input), expected);
        assert.strictEqual(await formatBladeString(expected), expected);
    });

    test('fragments do not stop early on arrows inside echos', async () => {
        const input = `
        <div
            {{
                $attributes
                    ->merge($getExtraAttributes())
            }}
            {{ that="this" }}
            A
            <?php echo $something; ?>
            B
            @php($why->not->that)
            C
            @directive($attributes->merge($getExtraAttributes()))
            D
            {{ $getExtraAlpineAttributeBag() }}
        >
        </div>
    `;
        const out = `<div
    {{
        $attributes->merge(
            $getExtraAttributes(),
        )
    }}
    {{ that = "this" }}
    A
    <?php echo $something; ?>
    B
    @php($why->not->that)
    C
    @directive($attributes->merge($getExtraAttributes()))
    D
    {{ $getExtraAlpineAttributeBag() }}
></div>
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it can align echos as if they were attributes or content', async () => {
        const input = `
<div
x-float{{ $placement ? ".placement.{$placement}" : '' }}.flip{{ $shift ? '.shift' : '' }}{{ $teleport ? '.teleport' : '' }}{{ $offset ? '.offset' : '' }}="{ offset: {{ $offset }} }"
x-on:input.debounce.{{ $debounce ?? '500ms' }}="updateState"

 {{ match ($foo) {
  "foo" => "foo",
  default => "bar",
  } }}><p>Hello, world.</p></div>
`;
        const out = `<div
    x-float{{ $placement ? ".placement.{$placement}" : '' }}.flip{{ $shift ? '.shift' : '' }}{{ $teleport ? '.teleport' : '' }}{{ $offset ? '.offset' : '' }}="{ offset: {{ $offset }} }"
    x-on:input.debounce.{{ $debounce ?? '500ms' }}="updateState"
    {{
        match ($foo) {
            'foo' => 'foo',
            default => 'bar',
        }
    }}
>
    <p>Hello, world.</p>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('it can format echos that contain php line comments', async () => {
        const input = `{{
    $attributes
// @something here
->class(['something']);
}}`;
        const out = `{{
    $attributes
        // @something here
        ->class(["something"]);
}}
`;

        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it can format echos that contain php block comments', async () => {
        const input = `{{
    $attributes
/* @something here */
->class(['something']);
}}`;
        const out = `{{
    $attributes
        /* @something here */
        ->class(["something"]);
}}
`;

        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it can format triple echos that contain php comments', async () => {
        const input = `{{{
    $attributes
// @something
/* @something here */
->class(['something']);
}}}`;
        const out = `{{{
    $attributes
        // @something
        /* @something here */
        ->class(["something"]);
}}}
`;

        assert.strictEqual(await formatBladeString(input), out);
    });

    test('it can format escape echos that contain php comments', async () => {
        const input = `{!!
    $attributes
// @something
/* @something here */
->class(['something']);
!!}`;
        const out = `{!!
    $attributes
        // @something
        /* @something here */
        ->class(["something"]);
!!}
`;

        assert.strictEqual(await formatBladeString(input), out);
    });

    test('inline echos are not duplicated in transformer', async () => {
        let input = `<div data-attribute={{ someCodeHere() }} ></div>`,
        out = `<div data-attribute="{{ someCodeHere() }}"></div>
`;
        assert.strictEqual(await formatBladeString(input), out);

        
        input = `<div data-attribute={{ someCodeHere() }} data-thing></div>`;
        out = `<div data-attribute="{{ someCodeHere() }}" data-thing></div>
`;
        assert.strictEqual(await formatBladeString(input), out);
    });

    test('strings containing @ inside echoes do not cause false positive directive matches', async () => {
        const template = `
{!! Something::here(['action' =>        'ControllerName@actionName']) !!}
{{ Something::here(['action' =>         'ControllerName2@actionName']) }}
{{{ Something::here(['action' =>                    'ControllerName3@actionName']) }}}
`;
        const expected = `{!! Something::here(['action' => 'ControllerName@actionName']) !!}
{{ Something::here(['action' => 'ControllerName2@actionName']) }}
{{{ Something::here(['action' => 'ControllerName3@actionName']) }}}
`;
        assert.strictEqual(await formatBladeStringWithPint(template), expected);
    });

    test('escaped echos are parsed correctly when they contain strings', async () => {
        const template = `One
        {!! __('I agree with the <a href="https://domain.com/privacy-policy">privacy policy</a>.') !!}
        Two`;
        const out = `One
{!! __('I agree with the <a href="https://domain.com/privacy-policy">privacy policy</a>.') !!}
Two
`;
        assert.strictEqual(await formatBladeString(template), out);
    })
});