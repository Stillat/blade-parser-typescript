import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Extends', () => {
    test('extends are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@extends('foo')
test`),
            `<?php echo $__env->make('foo', \\Illuminate\\Support\\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
test`
        );
        assert.strictEqual(
            PhpCompiler.compileString(`@extends(nameof(foo))
test`),
            `<?php echo $__env->make(nameof(foo), \\Illuminate\\Support\\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
test`
        );
    });
});