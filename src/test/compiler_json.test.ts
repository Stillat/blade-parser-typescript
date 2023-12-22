import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Json', () => {
    test('statement is compiled with safe default encoding options', () => {
        assert.strictEqual(
            PhpCompiler.compileString('var foo = @json($var);'),
            'var foo = <?php echo json_encode($var, 15, 512) ?>;'
        );
    });

    test('encoding options can be overwritten', () => {
        assert.strictEqual(
            PhpCompiler.compileString('var foo = @json($var, JSON_HEX_TAG);'),
            'var foo = <?php echo json_encode($var, JSON_HEX_TAG, 512) ?>;'
        );
    });
});