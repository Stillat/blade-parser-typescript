import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Yield', () => {
    test('yields are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@yield('foo')`),
            `<?php echo $__env->yieldContent('foo'); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@yield('foo', 'bar')`),
            `<?php echo $__env->yieldContent('foo', 'bar'); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@yield(name(foo))`),
            `<?php echo $__env->yieldContent(name(foo)); ?>`
        );
    });
});