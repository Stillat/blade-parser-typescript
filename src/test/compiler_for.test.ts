import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade For Statements', () => {
    test('for statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@endfor`),
            `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php endfor; ?>`
        );
    });

    test('nested for statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
@for ($j = 0; $j < 20; $j++)
test
@endfor
@endfor`),
            `<?php for($i = 0; $i < 10; $i++): ?>
<?php for($j = 0; $j < 20; $j++): ?>
test
<?php endfor; ?>
<?php endfor; ?>`
        );
    });
});