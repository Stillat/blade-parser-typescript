import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Cannot Statements', () => {
    test('cannot statements are compiled', () => {
        assert.strictEqual(PhpCompiler.compileString(`@cannot ('update', [$post])
breeze
@elsecannot('delete', [$post])
sneeze
@endcannot`), `<?php if (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->denies('update', [$post])): ?>
breeze
<?php elseif (app(\\Illuminate\\Contracts\\Auth\\Access\\Gate::class)->denies('delete', [$post])): ?>
sneeze
<?php endif; ?>`);
    });
});