import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Feature Statements', () => {
    test('feature statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@feature("api")
breeze
@endfeature`),
            `<?php if(Laravel\\Pennant\\Feature::active("api")): ?>
breeze
<?php endif; ?>`
        );
    });
});