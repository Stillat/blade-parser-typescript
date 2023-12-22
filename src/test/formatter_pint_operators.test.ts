import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Operators', () => {
    test('pint: it reflows not operator inside echos', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{{ ! $foo }}')).trim(),
            '{{ ! $foo }}'
        );
    });

    test('pint: it reflows not operators inisde echo 2', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{{ !                 $foo }}')).trim(),
            '{{ ! $foo }}'
        );
    });

    test('pint: it reflows not operators inisde echo 3', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{{ !$foo }}')).trim(),
            '{{ ! $foo }}'
        );
    });

    test('pint: it reflows not operators inisde echo 4', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{{{ !$foo }}}')).trim(),
            '{{{ ! $foo }}}'
        );
    });

    test('pint: it reflows not operators inside echo 5', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint('{!! !$foo !!}')).trim(),
            '{!! ! $foo !!}'
        );
    });

    test('pint: it reflows not operator inside conditions', async () => {
        const template = `
        @if(!$something)
            Do the thing.
                @endif
        `;
        const out = `@if (! $something)
    Do the thing.
@endif
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });

    test('pint: it does not break up inequality', async () => {
        const template = `@if ($foo !== 'bar')
@endif`;
        const out = `@if ($foo !== 'bar')
@endif
`;
        assert.strictEqual(await formatBladeStringWithPint(template), out);
    });
});