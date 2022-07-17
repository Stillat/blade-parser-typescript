import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Verbatim Formatting', () => {
    test('it indents verbatim', () => {
        assert.strictEqual(
            formatBladeString(`<div>
@verbatim


    <div class="container">
        Hello, {{ name }}.
    </div>

    
@endverbatim
</div>`).trim(),
            `<div>
    @verbatim
        <div class="container">
            Hello, {{ name }}.
        </div>
    @endverbatim
</div>`
        );
    });

    test('it ignores blade-like things inside verbatim', () => {
        assert.strictEqual(
            formatBladeString(`<div>
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