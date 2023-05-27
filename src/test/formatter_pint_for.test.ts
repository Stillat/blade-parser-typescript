import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: for Nodes', () => {
    test('pint: it correctly pairs and formats for nodes', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<p>
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
</p>`).trim(),
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