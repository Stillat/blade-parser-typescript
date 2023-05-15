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

    test('verbatim content is not lost', () => {
        const template = `@if (true)
        @if (false)
        @if ('something')
        @verbatim
            some content.
    @endverbatim
        @endif
        @endif
    @endif
    
    `;
        const out = `@if (true)
    @if (false)
        @if ("something")
            @verbatim
                some content.
            @endverbatim
        @endif
    @endif
@endif
`;
        assert.strictEqual(formatBladeString(template), out);
    });
});