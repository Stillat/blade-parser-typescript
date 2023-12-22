import assert from 'assert';
import { transformString } from './testUtils/transform.js';

suite('Basic Node Transform', () => {

    test('it transforms echos', async () => {
        assert.strictEqual(
            (await transformString('{{ $title }}')).trim(),
            "{{ $title }}"
        );
    });

    test('it transforms echo variant', async () => {
        assert.strictEqual(
            (await transformString('{{{ $title }}}')).trim(),
            "{{{ $title }}}"
        );
    });

    test('it transforms escaped echos', async () => {
        assert.strictEqual(
            (await transformString('{!! $title !!}')).trim(),
            "{!! $title !!}"
        );
    });

    test('it transforms simple comments', async () => {
        assert.strictEqual(
            (await transformString('{{-- Comment. --}}')).trim(),
            "{{-- Comment. --}}"
        );
    });

    test('it transforms block comments', async () => {
        assert.strictEqual(
            (await transformString(`{{--
                Block Comment. --}}`)).trim(),
            `{{--
    Block Comment.
--}}`
        );
    });

    test('it transforms block comments with html', async () => {
        assert.strictEqual(
            (await transformString(`{{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}`)).trim(),
            `{{--
    Block Comment.
    with many lines and with <stuff></stuff>
--}}`
        );
    });
});