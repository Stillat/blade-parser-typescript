import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Format JavaScript Attributes', () => {
    test('it does not attempt to format in unsafe situations', () => {
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
            {{-- A simple Blade comment. --}};

            var somethingHere = 'that';
        "
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
            <?php $doesThis = 'break Things'; ?>;

            var somethingHere = 'that';
        "
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
            <?= $whatAboutThis ?>;

            var somethingHere = 'that';
        "
    >
        <p>Test.</p>
    </button>
</div>

<div>
    <button
        x-bind:class="
    @for ($i = 0; $i < 10; $i++)
 test @endfor
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
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });
});