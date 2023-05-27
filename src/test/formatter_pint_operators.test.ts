import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Pint Transformer: Operators', () => {
    test('pint: it reflows not operator inside echos', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{ ! $foo }}').trim(),
            '{{ ! $foo }}'
        );
    });

    test('pint: it reflows not operators inisde echo 2', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{ !                 $foo }}').trim(),
            '{{ ! $foo }}'
        );
    });

    test('pint: it reflows not operators inisde echo 3', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{ !$foo }}').trim(),
            '{{ ! $foo }}'
        );
    });

    test('pint: it reflows not operators inisde echo 4', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{{{ !$foo }}}').trim(),
            '{{{ ! $foo }}}'
        );
    });

    test('pint: it reflows not operators inside echo 5', () => {
        assert.strictEqual(
            formatBladeStringWithPint('{!! !$foo !!}').trim(),
            '{!! ! $foo !!}'
        );
    });

    test('pint: it reflows not operator inside conditions', () => {
        const template = `
        @if(!$something)
            Do the thing.
                @endif
        `;
        const out = `@if (! $something)
    Do the thing.
@endif
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });

    test('pint: it does not break up inequality', () => {
        const template = `@if ($foo !== 'bar')
@endif`;
        const out = `@if ($foo !== 'bar')
@endif
`;
        assert.strictEqual(formatBladeStringWithPint(template), out);
    });
});