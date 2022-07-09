import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Props', () => {
    test('props are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@props(['one' => true, 'two' => 'string'])`),
            `<?php foreach($attributes->onlyProps(['one' => true, 'two' => 'string']) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
} ?>
<?php $attributes = $attributes->exceptProps(['one' => true, 'two' => 'string']); ?>
<?php foreach (array_filter((['one' => true, 'two' => 'string']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
} ?>
<?php $__defined_vars = get_defined_vars(); ?>
<?php foreach ($attributes as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
} ?>
<?php unset($__defined_vars); ?>`
        );
    });
});