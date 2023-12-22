import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Checked Statements', () => {
    test('selected statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`<input @selected(name(foo(bar)))/>`),
            "<input <?php if(name(foo(bar))): echo 'selected'; endif; ?>/>"
        );
    });

    test('checked statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`<input @checked(name(foo(bar)))/>`),
            "<input <?php if(name(foo(bar))): echo 'checked'; endif; ?>/>"
        );
    });

    test('disabled statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`<button @disabled(name(foo(bar)))>Foo</button>`),
            "<button <?php if(name(foo(bar))): echo 'disabled'; endif; ?>>Foo</button>"
        );
    });
});