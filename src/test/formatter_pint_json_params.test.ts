import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: JSON Parameters', () => {
    test('pint: it can detect and format JSON parameters in directives', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@varSet({
                "logo": 
                
                "logo",
                "width":             78,
                "height":
                         22
            })
            
            
            @varSet( $test +        $thing + $another - ($that + $something))`)).trim(),
            `@varSet({
  "logo": "logo",
  "width": 78,
  "height": 22
})

@varSet($test + $thing + $another - ($that + $something))`
        );
    });

    test('pint: it ignores invalid JSON when formatting', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@varSet({
"logo": 

"logo",
"width":     :::::        78,
"height":
22
})


@varSet( $test +        $thing + $another - ( $that + $something   ))`)).trim(),
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