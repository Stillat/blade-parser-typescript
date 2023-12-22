import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Conditional Element Directive Pair', () => {
    test('pint: it can indent directive pairs used as HTML elements', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`                    <@pair Test @endpair class="something">
            <div><p>SOme {{ $title }} text</p>
            <p>
            @pair <p>Something</p> @endpair
            </p>
        </div>
                </@pair Test @endpair>`)).trim(),
            `<@pair Test @endpair class="something">
    <div>
        <p>SOme {{ $title }} text</p>
        <p>
            @pair
                <p>Something</p>
            @endpair
        </p>
    </div>
</@pair Test @endpair>`
        );
    });

    test('pint: it can indent directives used as HTML elements', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<@directive >
            <div>
                @directive
            <p>This should be {{    $paired    }}</p>
                @enddirective
        </div>
                </@directive >`)).trim(),
            `<@directive>
    <div>
        @directive
            <p>This should be {{ $paired }}</p>
        @enddirective
    </div>
</@directive>`
        );
    });
});