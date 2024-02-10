import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Can Directive Formatting', () => {
    test('it can format can directive without errors', async () => {
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

@can("update", $model)
    update
@else
    any
@endcan`;
        assert.strictEqual((await formatBladeString(template)).trim(), expected.trim());
    });
});