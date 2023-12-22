import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Forelse Transformer', () => {
    test('it can transform forelse without an empty directive', async () => {
        assert.strictEqual(
            (await transformString(`<div>
@forelse ($users as $user)
<li>{{ $user->name }}</li>
@endforelse
</div>



@forelse ($users as $user)
<li>{{ $user->name }}
</li>
@endforelse`)).trim(),
            `<div>
@forelse ($users as $user)
<li>{{ $user->name }}</li>
@endforelse
</div>



@forelse ($users as $user)
<li>{{ $user->name }}
</li>
@endforelse`
        );
    });

    test('it can transform forelse', async () => {
        assert.strictEqual(
            (await transformString(`<div>
@forelse ($users as $user)
<li>{{ $user->name }}</li>
@empty
<p>No users</p>
@endforelse
</div>`)).trim(),
            `<div>
@forelse ($users as $user)
<li>{{ $user->name }}</li>
@empty

<p>No users</p>
@endforelse
</div>`
        );
    });

    test('it can transform forelse from a single line', async () => {
        assert.strictEqual(
            (await transformString(`<div> @forelse ($users as $user) <li>{{ $user->name }}</li> @empty <p>No users</p> @endforelse</div> `)).trim(),
            `<div> @forelse ($users as $user) <li>{{ $user->name }}</li> 
@empty
 <p>No users</p> @endforelse</div>`
        );
    });
});