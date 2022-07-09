import assert from 'assert';
import { PushOnceCompiler } from '../compiler/compilers';
import { PhpCompiler } from '../compiler/phpCompiler';
import { BladeDocument } from '../document/bladeDocument';
import { DirectiveNode } from '../nodes/nodes';

suite('Blade Push', () => {
    test('push is compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@push('foo')
test
@endpush`),
            `<?php $__env->startPush('foo'); ?>
test
<?php $__env->stopPush(); ?>`
        );
    });

    test('push once is compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@pushOnce('foo', 'bar')
test
@endPushOnce`),
            `<?php if (! $__env->hasRenderedOnce('bar')): $__env->markAsRenderedOnce('bar');
$__env->startPush('foo'); ?>
test
<?php $__env->stopPush(); endif; ?>`
        );
    });

    test('push once is compiled when id is missing', () => {
        const compiler = makePushOnceCompiler();

        assert.strictEqual(
            compiler.compile(BladeDocument.fromText(`@pushOnce('foo')
test
@endPushOnce`)),
            `<?php if (! $__env->hasRenderedOnce('e60e8f77-9ac3-4f71-9f8e-a044ef481d7f')): $__env->markAsRenderedOnce('e60e8f77-9ac3-4f71-9f8e-a044ef481d7f');
$__env->startPush('foo'); ?>
test
<?php $__env->stopPush(); endif; ?>`
        )
    });
});


function makePushOnceCompiler() {
    const compiler = new PhpCompiler(),
        prependOnce = compiler.getCompiler('pushOnce') as PushOnceCompiler;

    prependOnce.setIdResolver({
        id: (node: DirectiveNode) => {
            return 'e60e8f77-9ac3-4f71-9f8e-a044ef481d7f';
        }
    });

    return compiler;
}