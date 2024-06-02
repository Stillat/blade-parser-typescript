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

    test('ignored directive names do not cause excessive indentation when followed by an equals sign', async function () {
        const template = `
<div><div>
<div
    @click="if($wire.loginRequired){return}; isLiked = !isLiked; showUsers=false"
    wire:click="handle('{{ $key }}', '{{ $value["model"] }}')"
    @if ($authMode)
        @mouseover="
              if(
                  !$wire.loginRequired &&
                  $wire.reactions['{{ $key }}']['count'] > 0 &&
                   !showUsers
               ) {
                      showUsers = true;
                      $wire.lastReactedUser('{{ $key }}')
                  }
              "
    @endif
    class="flex cursor-pointer items-center"
    title="like"
>
</div>
</div>
</div>
    `;
        const expected = `<div>
    <div>
        <div
            @click="if($wire.loginRequired){return}; isLiked = !isLiked; showUsers=false"
            wire:click="handle('{{ $key }}', '{{ $value["model"] }}')"
            @if ($authMode)
                @mouseover="
                          if(
                              !$wire.loginRequired &&
                              $wire.reactions['{{ $key }}']['count'] > 0 &&
                               !showUsers
                           ) {
                                  showUsers = true;
                                  $wire.lastReactedUser('{{ $key }}')
                              }
                          "
            @endif
            class="flex cursor-pointer items-center"
            title="like"
        ></div>
    </div>
</div>
`;
        let out = await formatBladeString(template);
        assert.strictEqual(out, expected);

        for (let i = 0; i < 3; i++) {
            out = await formatBladeString(out);

            assert.strictEqual(out, expected);
        }
    });
});