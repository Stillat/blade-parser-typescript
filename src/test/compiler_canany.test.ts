import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Canany Statement', () => {
    test('canany statements are compiled', () => {
        assert.strictEqual(PhpCompiler.compileString(`@canany (['create', 'update'], [$post])
breeze
@elsecanany(['delete', 'approve'], [$post])
sneeze
@endcan`), `<?php if (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->any(['create', 'update'], [$post])): ?>
breeze
<?php elseif (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->any(['delete', 'approve'], [$post])): ?>
sneeze
<?php endif; ?>`);
    });
})