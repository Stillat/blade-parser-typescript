import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Comments', () => {
    test('comments are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('{{--this is a comment--}}'),
            ''
        );

        let longComment = '{{-- this is an ' + 'extremely '.repeat(1000) + 'long comment --}}';
        assert.strictEqual(
            PhpCompiler.compileString(longComment),
            ''
        );
    });

    test('blade code inside comments is not compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('{{-- @foreach() --}}'),
            ''
        );
    });
})