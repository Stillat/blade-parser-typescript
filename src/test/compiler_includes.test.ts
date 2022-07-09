import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Includes', () => {
    test('eaches are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@each(\'foo\', \'bar\')'),
            '<?php echo $__env->renderEach(\'foo\', \'bar\'); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@each(name(foo))'),
            '<?php echo $__env->renderEach(name(foo)); ?>'
        );
    });

    test('includes are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@include(\'foo\')'),
            '<?php echo $__env->make(\'foo\', \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\']))->render(); ?>'
        );


        assert.strictEqual(
            PhpCompiler.compileString('@include(name(foo))'),
            '<?php echo $__env->make(name(foo), \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\']))->render(); ?>'
        );
    });

    test('include ifs are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@includeIf(\'foo\')'),
            '<?php if ($__env->exists(\'foo\')) echo $__env->make(\'foo\', \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\']))->render(); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@includeIf(name(foo))'),
            '<?php if ($__env->exists(name(foo))) echo $__env->make(name(foo), \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\']))->render(); ?>'
        );
    });

    test('include whens are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@includeWhen(true, \'foo\', ["foo" => "bar"])'),
            '<?php echo $__env->renderWhen(true, \'foo\', ["foo" => "bar"], \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\'])); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@includeWhen(true, \'foo\')'),
            '<?php echo $__env->renderWhen(true, \'foo\', \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\'])); ?>'
        );
    });

    test('include unlesses are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@includeUnless(true, \'foo\', ["foo" => "bar"])'),
            '<?php echo $__env->renderUnless(true, \'foo\', ["foo" => "bar"], \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\'])); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@includeUnless($undefined ?? true, \'foo\')'),
            '<?php echo $__env->renderUnless($undefined ?? true, \'foo\', \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\'])); ?>'
        );
    });

    test('include firsts are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@includeFirst(["one", "two"])'),
            '<?php echo $__env->first(["one", "two"], \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\']))->render(); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@includeFirst(["one", "two"], ["foo" => "bar"])'),
            '<?php echo $__env->first(["one", "two"], ["foo" => "bar"], \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\']))->render(); ?>'
        )
    });
});