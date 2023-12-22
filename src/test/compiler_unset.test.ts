import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Unset Statements', () => {
    test('unset statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@unset($unset)`),
            `<?php unset($unset); ?>`
        );
    });
});