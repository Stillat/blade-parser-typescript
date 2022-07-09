import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Has Section', () => {
    test('has section statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@hasSection("section")
breeze
@endif`),
            `<?php if (! empty(trim($__env->yieldContent("section")))): ?>
breeze
<?php endif; ?>`
        );
    });
});