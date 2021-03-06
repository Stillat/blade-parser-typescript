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
});