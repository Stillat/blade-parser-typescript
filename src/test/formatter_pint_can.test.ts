import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Can Nodes', () => {
    test('pint: it can format can directive without errors', async () => {
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
        assert.strictEqual((await formatBladeStringWithPint(template)).trim(), expected.trim());
    });
});