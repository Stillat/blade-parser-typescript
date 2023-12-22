import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Environment Statements', () => {
    test('env statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@env('staging')
breeze
@else
boom
@endenv`),
            `<?php if(app()->environment('staging')): ?>
breeze
<?php else: ?>
boom
<?php endif; ?>`
        );
    });

    test('env statements with multiple string params are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@env('staging', 'production')
breeze
@else
boom
@endenv`),
            `<?php if(app()->environment('staging', 'production')): ?>
breeze
<?php else: ?>
boom
<?php endif; ?>`
        );
    });

    test('env statements with array param are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@env(['staging', 'production'])
breeze
@else
boom
@endenv`),
            `<?php if(app()->environment(['staging', 'production'])): ?>
breeze
<?php else: ?>
boom
<?php endif; ?>`
        );
    });

    test('production statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@production
breeze
@else
boom
@endproduction`),
            `<?php if(app()->environment('production')): ?>
breeze
<?php else: ?>
boom
<?php endif; ?>`
        );
    });
});