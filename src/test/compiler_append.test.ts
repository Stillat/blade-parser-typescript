import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Compiler Append', () => {
    test('it compiles append', () => {
        assert.strictEqual(PhpCompiler.compileString('@append'), '<?php $__env->appendSection(); ?>');
    });
});