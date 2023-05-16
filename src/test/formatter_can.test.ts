import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Can Directive Formatting', () => {
    test('it can format can directive without errors', () => {
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
    "model",
])

@can('update', $model)
    update
@else
    any
@endcan`;
        assert.strictEqual(formatBladeString(template).trim(), expected.trim());
    });
});