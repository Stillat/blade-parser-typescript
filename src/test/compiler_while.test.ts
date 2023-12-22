import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade While Statements', () => {
    test('while statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@while ($foo)
test
@endwhile`),
            `<?php while($foo): ?>
test
<?php endwhile; ?>`
        );
    });

    test('nested while statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@while ($foo)
@while ($bar)
test
@endwhile
@endwhile`),
            `<?php while($foo): ?>
<?php while($bar): ?>
test
<?php endwhile; ?>
<?php endwhile; ?>`
        );
    });
});