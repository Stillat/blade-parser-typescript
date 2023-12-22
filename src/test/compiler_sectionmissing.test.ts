import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Section Missing', () => {
    test('section missing statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@sectionMissing("section")
breeze
@endif`),
            `<?php if (empty(trim($__env->yieldContent("section")))): ?>
breeze
<?php endif; ?>`
        );
    });
});