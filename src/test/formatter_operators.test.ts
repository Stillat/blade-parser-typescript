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

    test('it does not break up inequality', () => {
        const template = `@if ($foo !== 'bar')
@endif`;
        const out = `@if ($foo !== "bar")
@endif
`;
        assert.strictEqual(formatBladeString(template), out);
    });
});