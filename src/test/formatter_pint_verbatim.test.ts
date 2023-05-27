import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Verbatim Nodes', () => {
    test('pint: it indents verbatim', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>
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

    test('pint: it ignores blade-like things inside verbatim', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>
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

    test('pint: verbatim content is not lost', () => {
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
        @if ('something')
            @verbatim
                some content.
            @endverbatim
        @endif
    @endif
@endif
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });
});