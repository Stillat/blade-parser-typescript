import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Directive Transformer', () => {
    test('it transforms directives', async () => {
        assert.strictEqual(
            (await transformString(`
<div>
    @pair

<div>
    @pair
    <p>Test one.</p>
    
    
<div>
    @pair

<div>
    @pair
    <p>Test two.</p>


<div>
    @pair

<div>
    @pair
    <p>Test three.</p>
    @endpair
</div>

@endpair
            </div>

    @endpair
</div>

@endpair
            </div>

    @endpair
</div>

@endpair
            </div>`)).trim(),
            `<div>
    @pair


<div>
    @pair

    <p>Test one.</p>


<div>
    @pair


<div>
    @pair

    <p>Test two.</p>


<div>
    @pair


<div>
    @pair

    <p>Test three.</p>
    @endpair

</div>

@endpair

            </div>

    @endpair

</div>

@endpair

            </div>

    @endpair

</div>

@endpair

            </div>`
        );
    });
});