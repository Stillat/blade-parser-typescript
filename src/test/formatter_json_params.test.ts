import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Directive JSON Parameters', () => {
    test('it can detect and format JSON parameters in directives', async () => {
        assert.strictEqual(
            (await formatBladeString(`@varSet({
                "logo": 
                
                "logo",
                "width":             78,
                "height":
                         22
            })
            
            
            @varSet( $test +        $thing + $another - (
            
                    $that + $something
            ))`)).trim(),
            `@varSet({
  "logo": "logo",
  "width": 78,
  "height": 22
})

@varSet($test + $thing + $another - ($that + $something))`
        );
    });

    test('it ignores invalid JSON when formatting', async () => {
        assert.strictEqual(
            (await formatBladeString(`@varSet({
"logo": 

"logo",
"width":     :::::        78,
"height":
22
})


@varSet( $test +        $thing + $another - (

        $that + $something
))`)).trim(),
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