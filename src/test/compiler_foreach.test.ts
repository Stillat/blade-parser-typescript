import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Foreach Statements', () => {
    test('foreach statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@foreach ($this->getUsers() as $user)
test
@endforeach`),
            `<?php $__currentLoopData = $this->getUsers(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
test
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>`
        );
    });

    test('foreach statements are compiled with uppercase syntax', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@foreach ($this->getUsers() AS $user)
test
@endforeach`),
            `<?php $__currentLoopData = $this->getUsers(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
test
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>`
        );
    });

    test('foreach statements are compiled with multiple line', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@foreach ([
foo,
bar,
] as $label)
test
@endforeach`),
            `<?php $__currentLoopData = [
foo,
bar,
]; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $label): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
test
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>`
        )
    });

    test('nested foreach statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@foreach ($this->getUsers() as $user)
user info
@foreach ($user->tags as $tag)
tag info
@endforeach
@endforeach`),
            `<?php $__currentLoopData = $this->getUsers(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
user info
<?php $__currentLoopData = $user->tags; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tag): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
tag info
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>`
        );
    });

    test('loop content holder is extracted from foreach statements', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@foreach ($some_uSers1 as $user)`),
            `<?php $__currentLoopData = $some_uSers1; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@foreach ($users->get() as $user)`),
            `<?php $__currentLoopData = $users->get(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@foreach (range(1, 4) as $user)`),
            `<?php $__currentLoopData = range(1, 4); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@foreach (   $users as $user)`),
            `<?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@foreach ($tasks as $task)`),
            `<?php $__currentLoopData = $tasks; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $task): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@foreach(resolve('App\\DataProviders'.\\$provider)->data() as \\$key => \\$value)
<input {{ \\$foo ? 'bar': 'baz' }}>
@endforeach`),
            `<?php $__currentLoopData = resolve('App\\DataProviders'.\\$provider)->data(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as \\$key => \\$value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
<input <?php echo e(\\$foo ? 'bar': 'baz'); ?>>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>`
        );
    });
});