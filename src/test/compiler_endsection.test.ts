import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade End Sections', () => {
    test('end sections are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@endsection'),
            '<?php $__env->stopSection(); ?>'
        );
    });
});