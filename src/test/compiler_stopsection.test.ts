import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Stop Section', () => {
    test('stop sections are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@stop'),
            '<?php $__env->stopSection(); ?>'
        );
    });
});