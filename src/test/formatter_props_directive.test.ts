import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Props Directive', () => {
    test('it can format props on many lines', () => {
        assert.strictEqual(
            formatBladeString(`
            @props(['hello', 'world'])
            
            <div>
            <div>
            @props(['hello', 'world', 'test' => [1,2,3,4,5, 'more' => ['hello', 'world', 'test' => [1,2,3,4,5]]]])
                                                                        </div>
                                            </div>
            
            <div>
            <p>Hello {{ $world }}!  </p>
                </div>`).trim(),
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

    test('it formats document with props', () => {
        assert.strictEqual(
            formatBladeString(`<x-icon


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



           
       </div>`).trim(),
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

    test('it leaves associative arrays alone', () => {
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
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it can wrap prop lists', () => {
        const template = `@props([
    'heading','footer',
])`;
        const out = `@props([
    "heading",
    "footer",
])
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it detects associative arrays', () => {
        const template = `@props([
    "foo" => [],
])`;
        const out = `@props([
    "foo" => [],
])
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it detects assoc arrays 2', () => {
        const template = `@props([
    'foo' => [],
    'foobarbaz' => false,
])`;
        const out = `@props([
    "foo" => [],
    "foobarbaz" => false,
])
`;
        assert.strictEqual(formatBladeString(template), out);
    });

    test('it does not force align mixed arrays', () => {
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
        assert.strictEqual(formatBladeString(input), out);
        assert.strictEqual(formatBladeString(out), out);
    });

    test('it doesnt wrap empty arrays', () => {
        const input = `@props([
            'actions' => [],
            'url',
        ])`;
        const out = `@props([
    "actions" => [],
    "url",
])
`;
        assert.strictEqual(formatBladeString(input), out);
        assert.strictEqual(formatBladeString(out), out);
    })
});