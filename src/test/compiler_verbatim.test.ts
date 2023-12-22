import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Verbatim Test', () => {
    test('verbatim blocks are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@verbatim {{ $a }} @if($b) {{ $b }} @endif @endverbatim`),
            ` {{ $a }} @if($b) {{ $b }} @endif `
        );
    });

    test('verbatim blocks with multiple lines are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`Some text
@verbatim
    {{ $a }}
    @if($b)
        {{ $b }}
    @endif
@endverbatim`),
            `Some text

    {{ $a }}
    @if($b)
        {{ $b }}
    @endif
`
        );
    });

    test('multiple verbatim blocks are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@verbatim {{ $a }} @endverbatim {{ $b }} @verbatim {{ $c }} @endverbatim`),
            ` {{ $a }}  <?php echo e($b); ?>  {{ $c }} `
        );
    });

    test('raw blocks are rendered in the right order', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@php echo "#1"; @endphp @verbatim {{ #2 }} @endverbatim @verbatim {{ #3 }} @endverbatim @php echo "#4"; @endphp`),
            `<?php echo "#1"; ?>  {{ #2 }}   {{ #3 }}  <?php echo "#4"; ?>`
        );
    });

    test('multiline templates with raw blocks are rendered in the right order', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`{{ $first }}
@php
    echo $second;
@endphp
@if ($conditional)
    {{ $third }}
@endif
@include("users")
@verbatim
    {{ $fourth }} @include("test")
@endverbatim
@php echo $fifth; @endphp`),
            `<?php echo e($first); ?>
<?php
    echo $second;
?>
<?php if($conditional): ?>
    <?php echo e($third); ?>
<?php endif; ?>
<?php echo $__env->make("users", \\Illuminate\\Support\\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    {{ $fourth }} @include("test")

<?php echo $fifth; ?>`
        );
    });

    test('raw blocks dont get mixed up when some are removed by blade comments', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`{{-- @verbatim Block #1 @endverbatim --}} @php "Block #2" @endphp`),
            ` <?php "Block #2" ?>`
        );
    });
});