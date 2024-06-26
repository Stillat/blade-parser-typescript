import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Inline PHP Transformer', () => {
    test('it can transform inline PHP', async () => {
        assert.strictEqual(
            (await transformString(`<<?php echo $element; ?>>
<?php echo $inline----  $$$$$; ?>
<p>Text <?php echo $inline             ; ?> here.</p>
</<?php echo $element; ?>>

<<?= echo $element; ?>>
<?= echo $inline  ; ?>
<p>Text <?= echo $inline             ; ?> here.</p>
</<?= echo $element; ?>>`)).trim(),
            `<<?php echo $element; ?>>

<?php echo $inline----  $$$$$; ?>

<p>Text <?php echo $inline             ; ?> here.</p>
</<?php echo $element; ?>>

<<?= echo $element; ?>>

<?= echo $inline  ; ?>

<p>Text <?= echo $inline             ; ?> here.</p>
</<?= echo $element; ?>>`
        );
    });
});