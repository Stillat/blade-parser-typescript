import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Component Tag Transform', () => {
    test('it can transform component tags', async () => {
        assert.strictEqual(
            (await transformString(`<x:slot:name

param="value">
<p>Content</p>
</x:slot:name>`)).trim(),
            `<x-slot:name param="value" >
<p>Content</p>
</x-slot>`
        );
    });

    test('it transforms inline echos', async () => {
        assert.strictEqual(
            (await transformString(`<option 
{{ $isSelected($value) ? 'selected="selected"' : '' }} value="{{ $value }}">
{{ $label }}
</option>`)).trim(),
            `<option
{{ $isSelected($value) ? 'selected="selected"' : '' }} value="{{ $value }}">
{{ $label }}
</option>`
        );
    });

    test('it transforms merged attributes', async () => {
        assert.strictEqual(
            (await transformString(`<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
{{ $message }}
</div>`)).trim(),
            `<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
{{ $message }}
</div>`
        );
    });
});