import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Operator Formatting Tests', () => {
    test('it reflows not operator inside echos', () => {
        assert.strictEqual(
            formatBladeString('{{ ! $foo }}').trim(),
            '{{ ! $foo }}'
        );

        assert.strictEqual(
            formatBladeString('{{ !                 $foo }}').trim(),
            '{{ ! $foo }}'
        );

        assert.strictEqual(
            formatBladeString('{{ !$foo }}').trim(),
            '{{ ! $foo }}'
        );

        assert.strictEqual(
            formatBladeString('{{{ !$foo }}}').trim(),
            '{{{ ! $foo }}}'
        );

        assert.strictEqual(
            formatBladeString('{!! !$foo !!}').trim(),
            '{!! ! $foo !!}'
        );
    });

    test('it reflows not operator inside conditions', () => {
        const template = `
        @if(!$something)
            Do the thing.
                @endif
        `;
        const out = `@if (! $something)
    Do the thing.
@endif
`;
        assert.strictEqual(formatBladeString(template), out);
    });
});