import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Break Statements', () => {
    test('break statements are compiled', () => {
        assert.strictEqual(PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@break
@endfor`), `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php break; ?>
<?php endfor; ?>`);
    });

    test('break statements with expression are compiled', () => {
        assert.strictEqual(PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@break(TRUE)
@endfor`), `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php if(TRUE) break; ?>
<?php endfor; ?>`);
    });

    test('break statements with argument are compiled', () => {
        assert.strictEqual(PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@break(2)
@endfor`), `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php break 2; ?>
<?php endfor; ?>`);
    });

    test('break statements with spaced argument are compiled', () => {
        assert.strictEqual(PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@break( 2 )
@endfor`), `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php break 2; ?>
<?php endfor; ?>`);
    });

    test('break statements with faulty argument are compiled', () => {
        assert.strictEqual(PhpCompiler.compileString(`@for ($i = 0; $i < 10; $i++)
test
@break(-2)
@endfor`), `<?php for($i = 0; $i < 10; $i++): ?>
test
<?php break 1; ?>
<?php endfor; ?>`);
    });
});