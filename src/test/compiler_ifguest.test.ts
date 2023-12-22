import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler.js';

suite('Blade If Guest Statements', () => {
    test('if statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@guest("api")
breeze
@endguest`),
            `<?php if(auth()->guard("api")->guest()): ?>
breeze
<?php endif; ?>`
        );
    });
});