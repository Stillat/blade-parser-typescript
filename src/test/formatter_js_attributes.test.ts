import assert from 'assert';
import { formatBladeString, formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Format JavaScript Attributes', () => {
    test('it does not attempt to format in unsafe situations', async () => {
         const input = `
<div>
<button
x-bind:class="
    var two = '@if (!$something) that @else that2 @endif';

    var somethingHere = 'that';
"
>
<p>Test.</p>
</button>
</div>

<div>
<button
x-bind:class="
    var two = '<x-alert />;

    var somethingHere = 'that';
"
>
<p>Test.</p>
</button>
</div>

<div>
<button
x-bind:class="
    {{-- A simple Blade comment. --}}

    var somethingHere = 'that';
"
>
<p>Test.</p>
</button>
</div>

<div>
<button
x-bind:class="
    <?php $doesThis = 'break Things'; ?>

    var somethingHere = 'that';
"
>
<p>Test.</p>
</button>
</div>

<div>
<button
x-bind:class="
    <?= $whatAboutThis ?>

    var somethingHere = 'that';
"
>
<p>Test.</p>
</button>
</div>

<div>
<button
x-bind:class="
    @for ($i = 0; $i < 10; $i++) test @endfor

    var somethingHere = 'that';
"
>
<p>Test.</p>
</button>
</div>

<div>
<button
x-bind:class="
@verbatim @continue @endverbatim

        var somethingHere = 'that';
"
>
<p>Test.</p>
</button>
</div>
`;
        const out = `<div>
    <button
        x-bind:class="
    var two = '@if (!$something) that @else that2 @endif';

    var somethingHere = 'that';
"
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
            var two = '<x-alert />;

                var somethingHere = 'that';
        "
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
            {{-- A simple Blade comment. --}}

            var somethingHere = 'that'
        "
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
            <?php $doesThis = 'break Things'; ?>

            var somethingHere = 'that'
        "
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
            <?= $whatAboutThis ?>

            var somethingHere = 'that'
        "
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
    @for ($i = 0; $i < 10; $i++) test @endfor

    var somethingHere = 'that';
"
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
@verbatim @continue @endverbatim
        var somethingHere = 'that';
"
    >
        <p>Test.</p>
    </button>
</div>
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
    });

    test('formatting js is disabled when it contains escaped data', async function () {
        const input = `<div x-data="{ data: {!! $data !!} }"></div>`;

        assert.strictEqual((await formatBladeStringWithPint(input)).trim(), input);
    });

    test('it ignores the js formatter if it contains escaped single quotes', async function () {
        const input = `<button x-on:click="console.log('I\\'m an escaped quote')">Text</button>`;

        assert.strictEqual((await formatBladeString(input)).trim(), input);
    });
});