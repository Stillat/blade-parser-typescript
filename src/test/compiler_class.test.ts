import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Class', () => {
    test('classes are conditionally compiled from array', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`<span @class(['font-bold', 'mt-4', 'ml-2' => true, 'mr-2' => false])></span>`),
            `<span class="<?php echo \\Illuminate\\Support\\Arr::toCssClasses(['font-bold', 'mt-4', 'ml-2' => true, 'mr-2' => false]) ?>"></span>`
        );
    });
});