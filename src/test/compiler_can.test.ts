import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade Can Statements', () => {
    test('can statements are compiled', () => {
        assert.strictEqual(PhpCompiler.compileString(`@can ('update', [$post])
breeze
@elsecan('delete', [$post])
sneeze
@endcan`), `<?php if (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->check('update', [$post])): ?>
breeze
<?php elseif (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->check('delete', [$post])): ?>
sneeze
<?php endif; ?>`);
    });
});