import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Stack', () => {
    test('stacks is compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@stack('foo')`),
            `<?php echo $__env->yieldPushContent('foo'); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@stack(name(foo))`),
            `<?php echo $__env->yieldPushContent(name(foo)); ?>`
        );
    });
});