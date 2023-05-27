import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: forelese Nodes', () => {
    test('pint: it indents forelse', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>
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

    test('pint: it can unwrap forelse from a single line', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div> @forelse ($users as $user) <li>{{ $user->name }}</li> @empty <p>No users</p> @endforelse</div> `).trim(),
            `<div>
    @forelse ($users as $user)
        <li>{{ $user->name }}</li>
    @empty
        <p>No users</p>
    @endforelse
</div>`
        );
    });

    test('pint: it can format forelse without an empty directive', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>
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

    test('pint: it formats valid PHP inside forelse', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>
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

    test('pint: it ignores invalid PHP inside forelse', () => {
        assert.strictEqual(
            formatBladeStringWithPint(`<div>
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
});