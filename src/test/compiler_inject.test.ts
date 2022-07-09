import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Inject', () => {
    test('dependencies injected as strings are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString("Foo @inject('baz', 'SomeNamespace\\SomeClass') bar"),
            "Foo <?php $baz = app('SomeNamespace\\SomeClass'); ?> bar"
        );
    });

    test('dependencies injected as strings are compiled injected with double quotes', () => {
        assert.strictEqual(
            PhpCompiler.compileString('Foo @inject("baz", "SomeNamespace\\SomeClass") bar'),
            'Foo <?php $baz = app("SomeNamespace\\SomeClass"); ?> bar'
        );
    });

    test('dependencies are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString("Foo @inject('baz', SomeNamespace\\SomeClass::class) bar"),
            "Foo <?php $baz = app(SomeNamespace\\SomeClass::class); ?> bar"
        );
    });

    test('dependencies are compiled with double quotes', () => {
        assert.strictEqual(
            PhpCompiler.compileString('Foo @inject("baz", SomeNamespace\\SomeClass::class) bar'),
            "Foo <?php $baz = app(SomeNamespace\\SomeClass::class); ?> bar"
        );
    });
});