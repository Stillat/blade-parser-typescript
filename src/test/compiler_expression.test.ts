import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Expression Test', () => {
    test('expressions on the same line', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@lang(foo(bar(baz(qux(breeze()))))) space () @lang(foo(bar))'),
            `<?php echo app('translator')->get(foo(bar(baz(qux(breeze()))))); ?> space () <?php echo app('translator')->get(foo(bar)); ?>`
        );
    });

    test('expression within html', () => {
        assert.strictEqual(
            PhpCompiler.compileString('<html {{ $foo }}>'),
            '<html <?php echo e($foo); ?>>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('<html{{ $foo }}>'),
            '<html<?php echo e($foo); ?>>'
        );

        assert.strictEqual(
            PhpCompiler.compileString(`<html {{ $foo }} @lang('foo')>`),
            '<html <?php echo e($foo); ?> <?php echo app(\'translator\')->get(\'foo\'); ?>>'
        )
    });
});