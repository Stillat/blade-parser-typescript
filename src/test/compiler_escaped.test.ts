import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Escaped', () => {
    test('escaped with at directives are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@@foreach'),
            '@foreach'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@@verbatim @@continue @@endverbatim'),
            '@verbatim @continue @endverbatim'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@@foreach($i as $x)'),
            '@foreach($i as $x)'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@@continue @@break'),
            '@continue @break'
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@@foreach(
            $i as $x
        )`),
            `@foreach(
            $i as $x
        )`
        );
    });
});