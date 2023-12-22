import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Inline PHP Formatting', () => {
    test('it can format basic inline PHP', async () => {
        assert.strictEqual(
            (await formatBladeString(`
<html>
        <?php

$kernel = $app->                make(Illuminate\\Contracts\\Console\\Kernel::class);

$status =           $kernel->

                        handle(
                                    $input = new Symfony\\Component\\Console\\Input\\ArgvInput,
                                    new Symfony\\Component\\Console\\Output\\ConsoleOutput
);

?>
</html>`)).trim(),
            `<html>
    <?php

    $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);

    $status = $kernel->handle(
        $input = new Symfony\\Component\\Console\\Input\\ArgvInput(),
        new Symfony\\Component\\Console\\Output\\ConsoleOutput(),
    );

    ?>
</html>`
        );
    });

    test('it can indent dynamic elements and spans', async () => {
        assert.strictEqual(
            (await formatBladeString(`<<?= $element; ?>>
            <?= $inline; ?>
        <p>Text <?= $inline             ; ?> here.</p>
    </<?= $element; ?>>

<<?php echo $element; ?>>
<?php echo $inline; ?>
<p>Text <?php echo $inline             ; ?> here.</p>
</<?php echo $element; ?>>


<h1><?php echo ($that +    $another    - $something) +    $thing   ?></h1>`)).trim(),
            `<<?= $element ?>>
    <?= $inline ?>

    <p>Text <?= $inline ?> here.</p>
</<?= $element ?>>

<<?php echo $element; ?>>
    <?php echo $inline; ?>

    <p>Text <?php echo $inline; ?> here.</p>
</<?php echo $element; ?>>

<h1><?php echo $that + $another - $something + $thing; ?></h1>`
        );
    });

    test('it preserves invalid PHP', async () => {
        assert.strictEqual(
            (await formatBladeString(`<<?php echo $element; ?>>
            <?php echo $inline----  $$$$$; ?>
            <p>Text <?php echo $inline             ; ?> here.</p>
            </<?php echo $element; ?>>
            
                            <<?= echo $element; ?>>
                                    <?= echo $inline  ; ?>
                    <p>Text <?= echo $inline             ; ?> here.</p>
                </<?= echo $element; ?>>`)).trim(),
            `<<?php echo $element; ?>>
    <?php echo $inline----  $$$$$; ?>

    <p>Text <?php echo $inline; ?> here.</p>
</<?php echo $element; ?>>

<<?= echo $element; ?>>
    <?= echo $inline  ; ?>

    <p>Text <?= echo $inline             ; ?> here.</p>
</<?= echo $element; ?>>`
        );
    });
});