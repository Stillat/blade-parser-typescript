import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Unless Transformer', () => {
    test('it can transform unless statements', async () => {
        assert.strictEqual(
            (await transformString(`@unless($something)
@unless($somethingTwo)
@unless($somethingThree)
@unless($somethingFour)
<div>
<p>I am just some {{ $text }}</p>
</div>
@endunless
@endunless
@endunless
@endunless`)).trim(),
            `@unless ($something)

@unless ($somethingTwo)

@unless ($somethingThree)

@unless ($somethingFour)

<div>
<p>I am just some {{ $text }}</p>
</div>
@endunless
@endunless
@endunless
@endunless`
        );
    });
});