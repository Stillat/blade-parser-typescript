import assert from 'assert';
import { transformString } from './testUtils/transform';

suite('Basic Node Transform', () => {

    test('it transforms echos', () => {
        assert.strictEqual(
            transformString('{{ $title }}').trim(),
            "{{ $title }}"
        );
    });

    test('it transforms echo variant', () => {
        assert.strictEqual(
            transformString('{{{ $title }}}').trim(),
            "{{{ $title }}}"
        );
    });

    test('it transforms escaped echos', () => {
        assert.strictEqual(
            transformString('{!! $title !!}').trim(),
            "{!! $title !!}"
        );
    });

    test('it transforms simple comments', () => {
        assert.strictEqual(
            transformString('{{-- Comment. --}}').trim(),
            "{{-- Comment. --}}"
        );
    });

    test('it transforms block comments', () => {
        assert.strictEqual(
            transformString(`{{--
                Block Comment. --}}`).trim(),
            `{{--
    Block Comment.
--}}`
        );
    });

    test('it transforms block comments with html', () => {
        assert.strictEqual(
            transformString(`{{--
 Block Comment.
 with many lines and with <stuff></stuff> --}}`).trim(),
            `{{--
    Block Comment.
    with many lines and with <stuff></stuff>
--}}`
        );
    });
});