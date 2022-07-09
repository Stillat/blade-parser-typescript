import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('Element Unless Transformer', () => {
    test('it transforms element unless', () => {
        assert.strictEqual(
            transformString(`<@unless($something)here @endunless class="something">
<div><p>SOme {{ $text }} text</p>
<@unless($something)here @endunless class="something">
<div><p>SOme {{ $text }} text</p>
</div>
    </@unless($something)here @endunless>
</div>
    </@unless($something)here @endunless>`).trim(),
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