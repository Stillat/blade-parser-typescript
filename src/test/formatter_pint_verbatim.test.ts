import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Verbatim Nodes', () => {
    test('pint: it indents verbatim', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div>
@verbatim


    <div class="container">
        Hello, {{ name }}.
    </div>

    
@endverbatim
</div>`)).trim(),
            `<div>
    @verbatim
        <div class="container">
            Hello, {{ name }}.
        </div>
    @endverbatim
</div>`
        );
    });

    test('pint: it ignores blade-like things inside verbatim', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div>
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

    test('pint: verbatim content is not lost', async () => {
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
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });
});