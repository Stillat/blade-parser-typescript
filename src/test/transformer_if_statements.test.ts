import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('If Statements Transformer', () => {
    test('it can transform if statements', async () => {
        assert.strictEqual(
            (await transformString(`@if($true)
Thing
@elseif($anotherValue)
More Things
@else
@if($true)
Thing
@elseif($anotherValue)
More Things
@else
Another Thing
@endif
@endif`)).trim(),
`@if ($true)
Thing
@elseif ($anotherValue)
More Things
@else

@if ($true)
Thing
@elseif ($anotherValue)
More Things
@else
Another Thing
@endif
@endif`
        );
    });
});