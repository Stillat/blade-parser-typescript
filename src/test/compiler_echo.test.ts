import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Echo', () => {
    test('echos are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('{!!$name!!}'),
            '<?php echo $name; ?>'
        );
        assert.strictEqual(
            PhpCompiler.compileString('{!! $name !!}'),
            '<?php echo $name; ?>'
        );
        assert.strictEqual(
            PhpCompiler.compileString(`{!!  
                $name
                    !!}`),
            '<?php echo $name; ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('{{{$name}}}'),
            '<?php echo e($name); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('{{$name}}'),
            '<?php echo e($name); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('{{ $name }}'),
            '<?php echo e($name); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString(`{{
                    $name
                }}`),
            '<?php echo e($name); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('{{ \\$name }}'),
            '<?php echo e(\\$name); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('{{ "Hello world or foo" }}'),
            '<?php echo e("Hello world or foo"); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('{{"Hello world or foo"}}'),
            '<?php echo e("Hello world or foo"); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString('{{$foo + $or + $baz}}'),
            '<?php echo e($foo + $or + $baz); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString(`{{
                    "Hello world or foo"
            }}`),
            '<?php echo e("Hello world or foo"); ?>'
        );

        assert.strictEqual(
            PhpCompiler.compileString(`{{ myFunc('foo or bar') }}`),
            `<?php echo e(myFunc('foo or bar')); ?>`
        );
    });

    test('escaped with at echos are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString('@{{$name}}'),
            '{{$name}}'
        );

        assert.strictEqual(
            PhpCompiler.compileString('@{{ $name }}'),
            '{{ $name }}'
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@{{ 
                $name 
            }}`),
            `{{ 
                $name 
            }}`
        );
    });
});