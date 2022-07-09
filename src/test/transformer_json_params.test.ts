import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('JSON Parameter Transformer', () => {
    test('it can transform directives with JSON parameters', () => {
        assert.strictEqual(
            transformString(`@varSet({
"logo": 

"logo",
"width":     :::::        78,
"height":
22
})

@varSet($test + $thing + $another - ($that + $something))`).trim(),
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