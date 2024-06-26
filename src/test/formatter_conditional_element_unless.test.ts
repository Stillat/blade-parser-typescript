import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Conditional Element Unless Statements', () => {
    test('it can detect and format conditional unless statements as HTML tags', async () => {
        assert.strictEqual(
            (await formatBladeString(`                        <@unless($something)here @endunless class="something">
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