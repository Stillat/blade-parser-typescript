import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Props Directive', () => {
    test('pint: it can format props on many lines', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x-icon


            :class="Arr::toCssClasses(['...'])" 
            
            
            
            
            />

@props(

       [          
         'icon'

                   ]
       
       
       )

<div>
<x-icon                      @class([$icon, "pe-2"] )
                                   />
           {{ $slot +   !$something}}



           
       </div>`)).trim(),
            `<x-icon :class="Arr::toCssClasses(['...'])" />

@props([
    'icon',

])

<div>
    <x-icon @class([$icon, 'pe-2']) />
    {{ $slot + ! $something }}
</div>`
        );
    });

    test('pint: it formats document with props', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<x-icon


            :class="Arr::toCssClasses(['...'])" 
            
            
            
            
            />
            
            @props(
            
            [           'icon'
            
            
            
                   ]
            
            
            )
            
            <div>
            <x-icon                      @class([$icon, 'pe-2'] )
                                   />
            {{ $slot }}
            
            
            
            
            </div>`)).trim(),
            `<x-icon :class="Arr::toCssClasses(['...'])" />

@props(['icon',

])

<div>
    <x-icon @class([$icon, 'pe-2']) />
    {{ $slot }}
</div>`
        );
    });

    test('pint: it leaves associative arrays alone', async () => {
        const template = `@props([
    'foo' => true,
            'bar'       => false,
                         'bar2'                   => false,
])`;
        const out = `@props([
    'foo' => true,
    'bar' => false,
    'bar2' => false,
])
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it can wrap prop lists', async () => {
        const template = `@props([
    'heading','footer',
])`;
        const out = `@props([
    'heading', 'footer',
])
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it detects associative arrays', async () => {
        const template = `@props([
    "foo" => [],
])`;
        const out = `@props([
    'foo' => [],
])
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it detects assoc arrays 2', async () => {
        const template = `@props([
    'foo' => [],
    'foobarbaz' => false,
])`;
        const out = `@props([
    'foo' => [],
    'foobarbaz' => false,
])
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it does not force align mixed arrays', async () => {
        const input = `@props([
    'foobarbaz' => true,
    'bar',
    'baz' => true,
])`;
        const out = `@props([
    'foobarbaz' => true,
    'bar',
    'baz' => true,
])
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
        assert.strictEqual(await formatBladeStringWithPint(out), out);
    });

    test('pint: it doesnt wrap empty arrays', async () => {
        const input = `@props([
            'actions' => [],
            'url',
        ])`;
        const out = `@props([
    'actions' => [],
    'url',
])
`;
        assert.strictEqual(await formatBladeStringWithPint(input), out);
        assert.strictEqual(await formatBladeStringWithPint(out), out);
    })
});