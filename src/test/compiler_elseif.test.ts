import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade ElseIf Statements', () => {
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