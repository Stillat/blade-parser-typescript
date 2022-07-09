import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade If Empty Statements', () => {
    test('if statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@empty ($test)
breeze
@endempty`),
            `<?php if(empty($test)): ?>
breeze
<?php endif; ?>`
        );
    });
});