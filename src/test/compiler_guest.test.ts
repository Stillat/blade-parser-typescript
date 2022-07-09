import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade Else Guest Statements', () => {
    test('guest if statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@guest("api")
breeze
@elseguest("standard")
wheeze
@endguest`),
            `<?php if(auth()->guard("api")->guest()): ?>
breeze
<?php elseif(auth()->guard("standard")->guest()): ?>
wheeze
<?php endif; ?>`
        );
    });
});