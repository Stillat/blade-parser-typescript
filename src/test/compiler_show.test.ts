import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Show', () => {
    test('shows are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@show'),
            `<?php echo $__env->yieldSection(); ?>`
        );
    });
});