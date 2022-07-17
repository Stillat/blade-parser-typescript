import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Directive JSON Parameters', () => {
    test('it can detect and format JSON parameters in directives', () => {
        assert.strictEqual(
            formatBladeString(`@varSet({
                "logo": 
                
                "logo",
                "width":             78,
                "height":
                         22
            })
            
            
            @varSet( $test +        $thing + $another - (
            
                    $that + $something
            ))`).trim(),
            `@varSet({
  "logo": "logo",
  "width": 78,
  "height": 22
})

@varSet($test + $thing + $another - ($that + $something))`
        );
    });

    test('it ignores invalid JSON when formatting', () => {
        assert.strictEqual(
            formatBladeString(`@varSet({
"logo": 

"logo",
"width":     :::::        78,
"height":
22
})


@varSet( $test +        $thing + $another - (

        $that + $something
))`).trim(),
            `@varSet({
"logo": 

"logo",
"width":     :::::        78,
"height":
22
})

@varSet($test + $thing + $another - ($that + $something))`
        );
    });
});