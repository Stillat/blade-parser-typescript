import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Forelse Formatting', () => {
    test('it formats foreach', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div>
        @foreach (   $users   as   $id   =>    $user    )
<li>{{ $user->name }}</li>
@endforeach
            </div>`)).trim(),
            `<div>
    @foreach ($users as $id => $user)
        <li>{{ $user->name }}</li>
    @endforeach
</div>`
        );
    });

    test('it indents forelse', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div>
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

    test('it can unwrap forelse from a single line', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div> @forelse ($users as $user) <li>{{ $user->name }}</li> @empty <p>No users</p> @endforelse</div> `)).trim(),
            `<div>
    @forelse ($users as $user)
        <li>{{ $user->name }}</li>
    @empty
        <p>No users</p>
    @endforelse
</div>`
        );
    });

    test('it can format forelse without an empty directive', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div>
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

    test('it formats valid PHP inside forelse', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div>
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

    test('it ignores invalid PHP inside forelse', async () => {
        assert.strictEqual(
            (await formatBladeString(`<div>
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

    test('formatting forlese empty with just literal content', async function () {
        const input = `@forelse ($items as $item)
        {{ $item }}
        @empty
        No items
        @endforelse`;
        const out = `@forelse ($items as $item)
    {{ $item }}
@empty
    No items
@endforelse`;
        assert.strictEqual((await formatBladeString(input)).trim(), out);
    });
});
