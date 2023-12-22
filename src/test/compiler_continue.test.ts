import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Continue', () => {
    test('continue statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@continue
@endfor`), `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php continue; ?>
<?php endfor; ?>`);
    });

    test('continue statements with expression are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@continue(TRUE)
@endfor`),
            `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php if(TRUE) continue; ?>
<?php endfor; ?>`
        );
    });

    test('continue statements with argument are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@continue(2)
@endfor`),
            `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php continue 2; ?>
<?php endfor; ?>`
        );
    });

    test('continue statements with spaced argument are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@continue( 2 )
@endfor`),
            `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php continue 2; ?>
<?php endfor; ?>`
        );
    });

    test('continue statements with faulty argument are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@continue(-2)
@endfor`),
            `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php continue 1; ?>
<?php endfor; ?>`
        );
    });
});