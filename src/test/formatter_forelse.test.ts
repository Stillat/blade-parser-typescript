import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Forelse Formatting', () => {
    test('it indents forelse', () => {
        assert.strictEqual(
            formatBladeString(`<div>
        @forelse ($users as $user)
<li>{{ $user->name }}</li>
@empty
<p>No users</p>
@endforelse
            </div>`).trim(),
            `<div>
    @forelse ($users as $user)
        <li>{{ $user->name }}</li>
    @empty
        <p>No users</p>
    @endforelse
</div>`
        );
    });

    test('it can unwrap forelse from a single line', () => {
        assert.strictEqual(
            formatBladeString(`<div> @forelse ($users as $user) <li>{{ $user->name }}</li> @empty <p>No users</p> @endforelse</div> `).trim(),
            `<div>
    @forelse ($users as $user)
        <li>{{ $user->name }}</li>
    @empty
        <p>No users</p>
    @endforelse
</div>`
        );
    });

    test('it can format forelse without an empty directive', () => {
        assert.strictEqual(
            formatBladeString(`<div>
        @forelse ($users as $user)
<li>{{ $user->name }}</li>
@endforelse
            </div>



        @forelse ($users as $user)
    <li>{{ $user->name }}
    </li>
@endforelse`).trim(),
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

    test('it formats valid PHP inside forelse', () => {
        assert.strictEqual(
            formatBladeString(`<div>
        @forelse ($users as                  $user)
<li>{{ $user->name }}</li>
@empty
<p>No users</p>
@endforelse
            </div>`).trim(),
            `<div>
    @forelse ($users as $user)
        <li>{{ $user->name }}</li>
    @empty
        <p>No users</p>
    @endforelse
</div>`
        );
    });

    test('it ignores invalid PHP inside forelse', () => {
        assert.strictEqual(
            formatBladeString(`<div>
        @forelse ($users as       ++++$           $user)
<li>{{ $user->name }}</li>
@empty
<p>No users</p>
@endforelse
            </div>`).trim(),
            `<div>
    @forelse ($users as       ++++$           $user)
        <li>{{ $user->name }}</li>
    @empty
        <p>No users</p>
    @endforelse
</div>`
        );
    });

    test('formatting forlese empty with just literal content', function () {
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
        assert.strictEqual(formatBladeString(input).trim(), out);
    });
});