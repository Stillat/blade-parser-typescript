import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Helpers', () => {
    test('echos are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@csrf'),
            '<?php echo csrf_field(); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@method('patch')`),
            '<?php echo method_field(\'patch\'); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@dd($var1)'),
            '<?php dd($var1); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@dd($var1, $var2)'),
            '<?php dd($var1, $var2); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@dump($var1, $var2)'),
            '<?php dump($var1, $var2); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@vite'),
            '<?php echo app(\'Illuminate\\Foundation\\Vite\')(); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@vite()'),
            '<?php echo app(\'Illuminate\\Foundation\\Vite\')(); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@vite(\'resources/js/app.js\')'),
            '<?php echo app(\'Illuminate\\Foundation\\Vite\')(\'resources/js/app.js\'); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@vite([\'resources/js/app.js\'])'),
            '<?php echo app(\'Illuminate\\Foundation\\Vite\')([\'resources/js/app.js\']); ?>'
        );


        assert.strictEqual(
            PhpCompiler.compileString('@viteReactRefresh'),
            '<?php echo app(\'Illuminate\\Foundation\\Vite\')->reactRefresh(); ?>'
        );
    });
});