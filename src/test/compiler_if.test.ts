import assert from 'assert';
import { PhpCompiler } from '../compiler/phpCompiler';

suite('Blade If Statements', () => {
    test('if statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@if (name(foo(bar)))
breeze
@endif`),
            `<?php if(name(foo(bar))): ?>
breeze
<?php endif; ?>`
        );
    });

    test('switch statements are compiled', () => {
        assert.strictEqual(
            PhpCompiler.compileString(`@switch(true)
@case(1)
foo

@case(2)
bar
@endswitch

foo

@switch(true)
@case(1)
foo

@case(2)
bar
@endswitch`),
            `<?php switch (true)
case (1): ?>

foo

<?php case(2): ?>
bar
<?php endswitch; ?>

foo

<?php switch (true)
case (1): ?>

foo

<?php case(2): ?>
bar
<?php endswitch; ?>`
        );
    });
});