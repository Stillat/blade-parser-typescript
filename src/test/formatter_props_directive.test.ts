import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Props Directive', () => {
    test('it can format props on many lines', async () => {
        assert.strictEqual(
            (await formatBladeString(`
            @props(['hello', 'world'])
            
            <div>
            <div>
            @props(['hello', 'world', 'test' => [1,2,3,4,5, 'more' => ['hello', 'world', 'test' => [1,2,3,4,5]]]])
                                                                        </div>
                                            </div>
            
            <div>
            <p>Hello {{ $world }}!  </p>
                </div>`)).trim(),
            `@props([
    "hello",
    "world",
])

<div>
    <div>
        @props([
            "hello",
            "world",
            "test" => [
                1,
                2,
                3,
                4,
                5,
                "more" => [
                    "hello",
                    "world",
                    "test" => [
                        1,
                        2,
                        3,
                        4,
                        5,
                    ],
                ],
            ],
        ])
    </div>
</div>

<div>
    <p>Hello {{ $world }}!</p>
</div>`
        );
    });

    test('it formats document with props', async () => {
        assert.strictEqual(
            (await formatBladeString(`<x-icon


            :class="Arr::toCssClasses(['...'])" 
            
            
            
            
            />

@props(

       [           'icon'
       
       
       
                   ]
       
       
       )

<div>
<x-icon                      @class([$icon,              'pe-2'] )
                                   />
           {{ $slot }}



           
       </div>`)).trim(),
            `<x-icon :class="Arr::toCssClasses(['...'])" />

@props([
    "icon",
])

<div>
    <x-icon @class([$icon, "pe-2"]) />
    {{ $slot }}
</div>`
        );
    });

    test('it leaves associative arrays alone', async () => {
        const template = `@props([
    'foo' => true,
            'bar'       => false,
                         'bar2'                   => false,
])`;
        const out = `@props([
    "foo" => true,
    "bar" => false,
    "bar2" => false,
])
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it can wrap prop lists', async () => {
        const template = `@props([
    'heading','footer',
])`;
        const out = `@props([
    "heading",
    "footer",
])
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it detects associative arrays', async () => {
        const template = `@props([
    "foo" => [],
])`;
        const out = `@props([
    "foo" => [],
])
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it detects assoc arrays 2', async () => {
        const template = `@props([
    'foo' => [],
    'foobarbaz' => false,
])`;
        const out = `@props([
    "foo" => [],
    "foobarbaz" => false,
])
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it does not force align mixed arrays', async () => {
        const input = `@props([
    'foobarbaz' => true,
    'bar',
    'baz' => true,
])`;
        const out = `@props([
    "foobarbaz" => true,
    "bar",
    "baz" => true,
])
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });

    test('it doesnt wrap empty arrays', async () => {
        const input = `@props([
            'actions' => [],
            'url',
        ])`;
        const out = `@props([
    "actions" => [],
    "url",
])
`;
        assert.strictEqual(await formatBladeString(input), out);
        assert.strictEqual(await formatBladeString(out), out);
    });
});