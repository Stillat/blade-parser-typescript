import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Component First', () => {
    test('component firsts are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@componentFirst(["one", "two"])`),
            `<?php $__env->startComponentFirst(["one", "two"]); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@componentFirst(["one", "two"], ["foo" => "bar"])`),
            `<?php $__env->startComponentFirst(["one", "two"], ["foo" => "bar"]); ?>`
        );
    });
});