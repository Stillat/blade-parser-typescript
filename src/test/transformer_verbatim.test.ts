import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Verbatim Transformer', () => {
    test('it can transform verbatim', async () => {
        assert.strictEqual(
            (await transformString(`<div>
@verbatim


<div class="container">
Hello, {{
name        }}.
</div>


@endverbatim
</div>`)).trim(),
            `<div>
@verbatim
    <div class="container">
    Hello, {{
    name        }}.
    </div>



@endverbatim
</div>`
        );
    });
});