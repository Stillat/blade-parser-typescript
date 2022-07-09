import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Section', () => {
    test('section starts are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@section('foo')`),
            `<?php $__env->startSection('foo'); ?>`
        );
        assert.strictEqual(
            PhpCompiler.compileString(`@section(name(foo))`),
            `<?php $__env->startSection(name(foo)); ?>`
        );
    });
});