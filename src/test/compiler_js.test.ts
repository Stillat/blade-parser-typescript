import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Js', () => {
    test('statement is compiled without any options', () => {
        assert.strictEqual(
            PhpCompiler.compileString('<div x-data="@js($data)"></div>'),
            '<div x-data="<?php echo \\Illuminate\\Support\\Js::from($data)->toHtml() ?>"></div>'
        );
    });

    test('json flags can be set', () => {
        assert.strictEqual(
            PhpCompiler.compileString('<div x-data="@js($data, JSON_FORCE_OBJECT)"></div>'),
            '<div x-data="<?php echo \\Illuminate\\Support\\Js::from($data, JSON_FORCE_OBJECT)->toHtml() ?>"></div>'
        );
    });

    test('encoding depth can be set', () => {
        assert.strictEqual(
            PhpCompiler.compileString('<div x-data="@js($data, JSON_FORCE_OBJECT, 256)"></div>'),
            '<div x-data="<?php echo \\Illuminate\\Support\\Js::from($data, JSON_FORCE_OBJECT, 256)->toHtml() ?>"></div>'
        );
    });
});