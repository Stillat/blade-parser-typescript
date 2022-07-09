import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade If Auth Statements', () => {
    test('if statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@auth("api")
breeze
@endauth`),
            `<?php if(auth()->guard("api")->check()): ?>
breeze
<?php endif; ?>`
        );
    });

    test('plain if statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@auth
breeze
@endauth`),
            `<?php if(auth()->guard()->check()): ?>
breeze
<?php endif; ?>`
        );
    });
});