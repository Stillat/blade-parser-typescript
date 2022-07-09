import assert from 'assert';
import { PrependOnceCompiler } from '../compiler/compilers';
import { PhpCompiler } from '../compiler/phpCompiler';
import { BladeDocument } from '../document/bladeDocument';
import { DirectiveNode } from '../nodes/nodes';

suite('Blade Prepend', () => {
    test('prepend is compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@prepend('foo')
bar
@endprepend`),
            `<?php $__env->startPrepend('foo'); ?>
bar
<?php $__env->stopPrepend(); ?>`
        );
    });

    test('prepend once is compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@prependOnce('foo', 'bar')
test
@endPrependOnce`),
            `<?php if (! $__env->hasRenderedOnce('bar')): $__env->markAsRenderedOnce('bar');
$__env->startPrepend('foo'); ?>
test
<?php $__env->stopPrepend(); endif; ?>`
        );
    });

    test('prepend once is compiled when id is missing', () => {
        const compiler = makePrependOnceCompiler();
        assert.strictEqual(
            compiler.compile(BladeDocument.fromText(`@prependOnce('foo')
test
@endPrependOnce`)),
            `<?php if (! $__env->hasRenderedOnce('e60e8f77-9ac3-4f71-9f8e-a044ef481d7f')): $__env->markAsRenderedOnce('e60e8f77-9ac3-4f71-9f8e-a044ef481d7f');
$__env->startPrepend('foo'); ?>
test
<?php $__env->stopPrepend(); endif; ?>`
        )
    });
});

function makePrependOnceCompiler() {
    const compiler = new PhpCompiler(),
        prependOnce = compiler.getCompiler('prependOnce') as PrependOnceCompiler;

    prependOnce.setIdResolver({
        id: (node: DirectiveNode) => {
            return 'e60e8f77-9ac3-4f71-9f8e-a044ef481d7f';
        }
    });

    return compiler;
}