import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Feature Statements', () => {
    test('featureany statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@featureany(["api-v1","api-v2"])
breeze
@endfeatureany`),
            `<?php if(Laravel\\Pennant\\Feature::someAreActive(["api-v1","api-v2"])): ?>
breeze
<?php endif; ?>`
        );
    });
});