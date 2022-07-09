import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('Verbatim Transformer', () => {
    test('it can transform verbatim', () => {
        assert.strictEqual(
            transformString(`<div>
@verbatim


<div class="container">
Hello, {{
name        }}.
</div>


@endverbatim
</div>`).trim(),
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