import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Forelse Statements', () => {
    test('forelse statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@forelse ($this->getUsers() as $user)
breeze
@empty
empty
@endforelse`),
            `<?php $__empty_1 = true; $__currentLoopData = $this->getUsers(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
breeze
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
empty
<?php endif; ?>`
        );
    });

    test('forelse statements are compiled with uppercase syntax', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@forelse ($this->getUsers() AS $user)
breeze
@empty
empty
@endforelse`),
            `<?php $__empty_1 = true; $__currentLoopData = $this->getUsers(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
breeze
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
empty
<?php endif; ?>`
        )
    });

    test('forelse statements are compiled with multiple line', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@forelse ([
foo,
bar,
] as $label)
breeze
@empty
empty
@endforelse`),
            `<?php $__empty_1 = true; $__currentLoopData = [
foo,
bar,
]; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $label): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
breeze
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
empty
<?php endif; ?>`
        );
    });

    test('nested forelse statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@forelse ($this->getUsers() as $user)
@forelse ($user->tags as $tag)
breeze
@empty
tag empty
@endforelse
@empty
empty
@endforelse`),
            `<?php $__empty_1 = true; $__currentLoopData = $this->getUsers(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
<?php $__empty_2 = true; $__currentLoopData = $user->tags; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tag): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_2 = false; ?>
breeze
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_2): ?>
tag empty
<?php endif; ?>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
empty
<?php endif; ?>`
        );
    });
});