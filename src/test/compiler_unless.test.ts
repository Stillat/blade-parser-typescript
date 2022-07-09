import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Unless Statements', () => {
    test('unless statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@unless (name(foo(bar)))
breeze
@endunless`),
            `<?php if (! (name(foo(bar)))): ?>
breeze
<?php endif; ?>`
        );
    });
});