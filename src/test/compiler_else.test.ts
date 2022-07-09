import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Else Statements', () => {
    test('else statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@if (name(foo(bar)))
breeze
@else
boom
@endif`),
            `<?php if(name(foo(bar))): ?>
breeze
<?php else: ?>
boom
<?php endif; ?>`
        );
    });

    test('else if statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@if(name(foo(bar)))
breeze
@elseif(boom(breeze))
boom
@endif`),
            `<?php if(name(foo(bar))): ?>
breeze
<? elseif(boom(breeze)): ?>
boom
<?php endif; ?>`
        );
    });
});