import assert from 'assert';
import { ComponentCompiler } from '../compiler/compilers/index.js';
import { PhpCompiler } from '../compiler/phpCompiler.js';
import { BladeDocument } from '../document/bladeDocument.js';

suite('Blade Components', () => {
    test('components are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@component('foo', ["foo" => "bar"])`),
            `<?php $__env->startComponent('foo', ["foo" => "bar"]); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@component('foo')`),
            `<?php $__env->startComponent('foo'); ?>`
        );
    });

    test('class components are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@component('Test::class', 'test', ["foo" => "bar"])`),
            `<?php if (isset($component)) { $__componentOriginal35bda42cbf6f9717b161c4f893644ac7a48b0d98 = $component; } ?>
<?php $component = $__env->getContainer()->make(Test::class, ["foo" => "bar"] + (isset($attributes) ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('test'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>`
        );
    });

    test('end components are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@endcomponent`),
            `<?php echo $__env->renderComponent(); ?>`
        );
    });

    test('end component classes are compiled', () => {
        const compiler = new PhpCompiler(),
            componentCompiler = compiler.getCompiler('component') as ComponentCompiler;
        componentCompiler.pushHash(ComponentCompiler.newComponentHash('foo'));

        assert.strictEqual(
            compiler.compile(BladeDocument.fromText(`@endcomponentClass`)),
            `'<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33)): ?>
<?php $component = $__componentOriginal0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33; ?>
<?php unset($__componentOriginal0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33); ?>
<?php endif; ?>`
        );
    });

    test('slots are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@slot('foo', null, ["foo" => "bar"])`),
            `<?php $__env->slot('foo', null, ["foo" => "bar"]); ?>`
        );

        assert.strictEqual(
            PhpCompiler.compileString(`@slot('foo')`),
            `<?php $__env->slot('foo'); ?>`
        );
    });

    test('end slots are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@endslot`),
            `<?php $__env->endSlot(); ?>`
        );
    });
});