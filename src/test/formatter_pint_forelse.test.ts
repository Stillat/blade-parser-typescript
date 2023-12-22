import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: forelese Nodes', () => {
    test('pint: it indents forelse', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div>
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

    test('pint: it can unwrap forelse from a single line', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div> @forelse ($users as $user) <li>{{ $user->name }}</li> @empty <p>No users</p> @endforelse</div> `)).trim(),
            `<div>
    @forelse ($users as $user)
        <li>{{ $user->name }}</li>
    @empty
        <p>No users</p>
    @endforelse
</div>`
        );
    });

    test('pint: it can format forelse without an empty directive', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div>
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
    <li>{{ $user->name }}</li>
@endforelse`
        );
    });

    test('pint: it formats valid PHP inside forelse', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div>
        @forelse ($users as                  $user)
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

    test('pint: it ignores invalid PHP inside forelse', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`<div>
        @forelse ($users as       ++++$           $user)
<li>{{ $user->name }}</li>
@empty
<p>No users</p>
@endforelse
            </div>`)).trim(),
            `<div>
    @forelse ($users as       ++++$           $user)
        <li>{{ $user->name }}</li>
    @empty
        <p>No users</p>
    @endforelse
</div>`
        );
    });
});