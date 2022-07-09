import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('Conditional Element Pair Transform', () => {
    test('it can transform element pairs', () => {
        assert.strictEqual(
            transformString(`                    <@pair Test @endpair class="something">
<div><p>SOme {{ $title }} text</p>
<p>
@pair <p>Something</p> @endpair
</p>
</div>
    </@pair Test @endpair>`).trim(),
            `<@pair Test @endpair class="something">
<div><p>SOme {{ $title }} text</p>
<p>
@pair
 <p>Something</p> @endpair

</p>
</div>
    </@pair Test @endpair >`
        );
    });
});