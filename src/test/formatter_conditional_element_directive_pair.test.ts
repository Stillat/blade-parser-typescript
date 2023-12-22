import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Conditional HTML Pair Directive Pairs', () => {
    test('it can indent directive pairs used as HTML elements', async () => {
        assert.strictEqual(
            (await formatBladeString(`                    <@pair Test @endpair class="something">
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

    test('it can indent directives used as HTML elements', async () => {
        assert.strictEqual(
            (await formatBladeString(`<@directive >
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