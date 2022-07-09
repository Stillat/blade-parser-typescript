import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Auth Statements', () => {
    test('else auth statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@auth("api")
breeze
@elseauth("standard")
wheeze
@endauth`),
            `<?php if(auth()->guard("api")->check()): ?>
breeze
<?php elseif(auth("standard")->guard()->check()): ?>
wheeze
<?php endif; ?>`
        );
    });

    test('plain else auth statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@auth("api")
breeze
@elseauth
wheeze
@endauth`),
            `<?php if(auth()->guard("api")->check()): ?>
breeze
<?php elseif(auth()->guard()->check()): ?>
wheeze
<?php endif; ?>`
        );
    })
});