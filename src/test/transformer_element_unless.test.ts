import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Element Unless Transformer', () => {
    test('it transforms element unless', async () => {
        assert.strictEqual(
            (await transformString(`<@unless($something)here @endunless class="something">
<div><p>SOme {{ $text }} text</p>
<@unless($something)here @endunless class="something">
<div><p>SOme {{ $text }} text</p>
</div>
    </@unless($something)here @endunless>
</div>
    </@unless($something)here @endunless>`)).trim(),
            `<@unless($something)here @endunless class="something">
<div><p>SOme {{ $text }} text</p>
<@unless($something)here @endunless class="something">
<div><p>SOme {{ $text }} text</p>
</div>
    </@unless($something)here @endunless >
</div>
    </@unless($something)here @endunless >`
        );
    });
});