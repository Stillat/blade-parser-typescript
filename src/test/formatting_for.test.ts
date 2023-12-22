import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Formatting Blade For', () => {
    test('it correctly pairs and formats for nodes', async () => {
        assert.strictEqual(
            (await formatBladeString(`<p>
<strong>Message</strong>
@if($one)
One
@elseif($two)
    <ul></ul>

    @for ($i = 0; $i < 10; $i++)
    The current value is {{ $i }}
@endfor
    Something here.
@else
    Nope!
@endif
</p>`)).trim(),
            `<p>
    <strong>Message</strong>
    @if ($one)
        One
    @elseif ($two)
        <ul></ul>

        @for ($i = 0; $i < 10; $i++)
            The current value is {{ $i }}
        @endfor
        Something here.
    @else
        Nope!
    @endif
</p>`
        )
    });
});