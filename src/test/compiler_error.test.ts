import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Error', () => {
    test('errors are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@error(\'email\')
    <span>{{ $message }}</span>
@enderror`),
            `<?php $__errorArgs = ['email'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
    <span><?php echo e($message); ?></span>
<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>`
        );
    });

    test('errors with bags are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@error(\'email\', \'customBag\')
    <span>{{ $message }}</span>
@enderror`),
            `<?php $__errorArgs = ['email', 'customBag'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
    <span><?php echo e($message); ?></span>
<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>`
        );
    });
});