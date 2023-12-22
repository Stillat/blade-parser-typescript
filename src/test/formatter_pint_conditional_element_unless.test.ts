import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Conditional Element Unless', () => {
    test('pint: it can detect and format conditional unless statements as HTML tags', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`                        <@unless($something)here @endunless class="something">
            <div><p>SOme {{ $text }} text</p>
                                    <@unless($something)here @endunless class="something">
            <div><p>SOme {{ $text }} text</p>
        </div>
                </@unless($something)here @endunless>
        </div>
                </@unless($something)here @endunless>`)).trim(),
            `<@unless($something)here @endunless class="something">
    <div>
        <p>SOme {{ $text }} text</p>
        <@unless($something)here @endunless class="something">
            <div><p>SOme {{ $text }} text</p></div>
        </@unless($something)here @endunless>
    </div>
</@unless($something)here @endunless>`
        );
    });
});