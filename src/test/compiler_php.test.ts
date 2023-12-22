import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade PHP Statements', () => {
    test('php statements with expressions are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@php($set = true)`),
            '<?php ($set = true); ?>'
        );
    });

    test('php statements without expression are ignored', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@php'),
            '@php'
        );

        assert.strictEqual(
            PhpCompiler.compileString(`{{ "Ignore: @php" }}`),
            `<?php echo e("Ignore: @php"); ?>`
        );
    });

    test('php statements dont parse blade code', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@php echo "{{ This is a blade tag }}" @endphp`),
            `<?php echo "{{ This is a blade tag }}" ?>`
        );
    });

    test('verbatim and php statements dont get mixed up', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@verbatim {{ Hello, I'm not blade! }}
@php echo 'And I'm not PHP!' @endphp
@endverbatim {{ 'I am Blade' }}
@php echo 'I am PHP {{ not Blade }}' @endphp`),
            ` {{ Hello, I'm not blade! }}
@php echo 'And I'm not PHP!' @endphp
 <?php echo e('I am Blade'); ?>
<?php echo 'I am PHP {{ not Blade }}' ?>`
        );
    });

    test('strings with parenthesis', () => {
        // Note: The Laravel test suite expects this to _not_ work.
        assert.strictEqual(
            PhpCompiler.compileString(`@php($data = ['test' => ')'])`),
            `<?php ($data = ['test' => ')']); ?>`
        );
    });

    test('string with empty string data value', () => {
        assert.strictEqual(
            PhpCompiler.compileString("@php($data = ['test' => ''])"),
            `<?php ($data = ['test' => '']); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString("@php($data = ['test' => \"\"])"),
            `<?php ($data = ['test' => ""]); ?>`
        );
    });

    test('strings with escaping data value', () => {
        assert.strictEqual(
            PhpCompiler.compileString("@php($data = ['test' => 'won\\'t break'])"),
            `<?php ($data = ['test' => 'won\\'t break']); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString("@php($data = ['test' => \"\\\"escaped\\\"\"])"),
            `<?php ($data = ['test' => "\\"escaped\\""]); ?>`
        );
    });
});