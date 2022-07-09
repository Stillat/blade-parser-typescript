import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Lang', () => {
    test('statement that contains non consecutive parenthesis are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString("Foo @lang(function_call('foo(blah)')) bar"),
            "Foo <?php echo app('translator')->get(function_call('foo(blah)')); ?> bar"
        );
    });

    test('language and choices are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString("@lang('foo')"),
            '<?php echo app(\'translator\')->get(\'foo\'); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString("@choice('foo', 1)"),
            '<?php echo app(\'translator\')->choice(\'foo\', 1); ?>'
        );
    });
});