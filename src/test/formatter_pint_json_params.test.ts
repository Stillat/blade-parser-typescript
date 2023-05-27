import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: JSON Parameters', () => {
    test('pint: it can detect and format JSON parameters in directives', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`@varSet({
                "logo": 
                
                "logo",
                "width":             78,
                "height":
                         22
            })
            
            
            @varSet( $test +        $thing + $another - ($that + $something))`).trim(),
            `@varSet({
  "logo": "logo",
  "width": 78,
  "height": 22
})

@varSet($test + $thing + $another - ($that + $something))`
        );
    });

    test('pint: it ignores invalid JSON when formatting', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`@varSet({
"logo": 

"logo",
"width":     :::::        78,
"height":
22
})


@varSet( $test +        $thing + $another - ( $that + $something   ))`).trim(),
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