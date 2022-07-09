import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade if Isset Statements', () => {
    test('if statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@isset ($test)
breeze
@endisset`),
            `<?php if(isset($test)): ?>
breeze
<?php endif; ?>`
        );
    });
});