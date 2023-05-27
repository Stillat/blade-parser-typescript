import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Can Nodes', () => {
    test('pint: it can format can directive without errors', () => {
        const template = `{{-- foo.blade.php --}}

@props([
"model",
])

@can('update', $model)
update
@else
any
@endcan`;
        const expected = `{{-- foo.blade.php --}}

@props([
    'model',
])

@can('update', $model)
    update
@else
    any
@endcan`;
        assert.strictEqual(formatBladeStringWithPint(template).trim(), expected.trim());
    });
});