import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';
import { defaultSettings } from '../formatting/optionDiscovery.js';
import { setupTestHooks } from './testUtils/formatting.js';

async function formatBladeStringInlineEcho(content:string): Promise<string> {
    const options = defaultSettings;

    return await formatBladeString(content, {
        ...options,
        echoStyle: 'inline'
    });
}

suite('Inline Echo Formatting', () => {
    setupTestHooks();

    test('it formats valid PHP code', async () => {
        assert.strictEqual(
            (await formatBladeStringInlineEcho('{{$test   +$that}}')).trim(),
            '{{ $test + $that }}'
        );
    });

    test('it formats valid PHP code in {!!', async () => {
        assert.strictEqual(
            (await formatBladeStringInlineEcho('{!!$test   +$that!!}')).trim(),
            '{!! $test + $that !!}'
        );
    });

    test('it formats valid PHP code in {{{', async () => {
        assert.strictEqual(
            (await formatBladeStringInlineEcho('{{{$test   +$that}}}')).trim(),
            '{{{ $test + $that }}}'
        );
    });

    test('it ingores invalid PHP code', async () => {
        assert.strictEqual(
            (await formatBladeStringInlineEcho('{{$test   $+++$that}}')).trim(),
            '{{ $test   $+++$that }}'
        );
    });

    test('it ignores invalid PHP code in {!!', async () => {
        assert.strictEqual(
            (await formatBladeStringInlineEcho('{!!$test   $+++$that!!}')).trim(),
            '{!! $test   $+++$that !!}'
        );
    });

    test('it formats php without crashing', async () => {
        const input = `{{ str_pad($loop->index + 1, 2, '0', STR_PAD_LEFT) }}`;
        const out = `{{ str_pad($loop->index + 1, 2, "0", STR_PAD_LEFT) }}`;
        assert.strictEqual((await formatBladeStringInlineEcho(input)).trim(), out);
    });

    test('it ignores invalid PHP code in {{{', async () => {
        assert.strictEqual(
            (await formatBladeStringInlineEcho('{{{$test   $+++$that}}}')).trim(),
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
        assert.strictEqual((await formatBladeStringInlineEcho(input)).trim(), expected);
    });

    test('it can format inline echos as text', async () => {
        assert.strictEqual(
            (await formatBladeStringInlineEcho(`
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
        assert.strictEqual((await formatBladeStringInlineEcho(input)).trim(), out);
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
    {{ $attributes
        ->whereDoesntStartWith("wire:model")
        ->class(["flex gap-3 text-sm"]) }}
></label>
`;
        assert.strictEqual(await formatBladeStringInlineEcho(input), out);
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
    {{ $foo->bar([
        "foo" => $foo,
        "bar" => $bar,
        "baz" => $baz,
    ]) }}
</div>
`;
        assert.strictEqual(await formatBladeStringInlineEcho(input), out);
        assert.strictEqual(await formatBladeStringInlineEcho(out), out);
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
    {{ $attributes->class([
        "some classes",
        match ($someCondition) {
            true => "more classes foo bar baz",
            default => "even more classes foo bar baz",
        },
    ]) }}
></div>
`;
        assert.strictEqual(await formatBladeStringInlineEcho(input), out);
        assert.strictEqual(await formatBladeStringInlineEcho(out), out);
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
    {{ $attributes->class([
        "some classes",
        match ($someCondition) {
            true => "more classes foo bar baz",
            default => "even more classes foo bar baz",
        },
    ]) }}
    more
    attributes
    class="one two three"
    something="else"
></div>
`;
        assert.strictEqual(await formatBladeStringInlineEcho(input), out);
        assert.strictEqual(await formatBladeStringInlineEcho(out), out);
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
    {{ match ($foo) {
        "foo" => "foo",
        default => "bar",
    } }}
></div>`;
        assert.strictEqual((await formatBladeStringInlineEcho(template)).trim(), out);
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
        assert.strictEqual(await formatBladeStringInlineEcho(input), output);
    });

    test('it inlines adjacent echos', async () => {
        const input = `<div>
    {{ $foo }}{{ $bar }}
</div>`;
        const out = `<div>{{ $foo }}{{ $bar }}</div>
`;
        assert.strictEqual(await formatBladeStringInlineEcho(input), out);
    });
});