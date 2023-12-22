import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Overwrite Section', () => {
    test('overwrite sections are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@overwrite'),
            '<?php $__env->stopSection(true); ?>'
        );
    });
});