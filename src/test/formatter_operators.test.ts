import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';

suite('Operator Formatting Tests', () => {
    test('it reflows not operator inside echos', async () => {
        assert.strictEqual(
            (await formatBladeString('{{ ! $foo }}')).trim(),
            '{{ ! $foo }}'
        );

        assert.strictEqual(
            (await formatBladeString('{{ !                 $foo }}')).trim(),
            '{{ ! $foo }}'
        );

        assert.strictEqual(
            (await formatBladeString('{{ !$foo }}')).trim(),
            '{{ ! $foo }}'
        );

        assert.strictEqual(
            (await formatBladeString('{{{ !$foo }}}')).trim(),
            '{{{ ! $foo }}}'
        );

        assert.strictEqual(
            (await formatBladeString('{!! !$foo !!}')).trim(),
            '{!! ! $foo !!}'
        );
    });

    test('it reflows not operator inside conditions', async () => {
        const template = `
        @if(!$something)
            Do the thing.
                @endif
        `;
        const out = `@if (! $something)
    Do the thing.
@endif
`;
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it does not break up inequality', async () => {
        const template = `@if ($foo !== 'bar')
@endif`;
        const out = `@if ($foo !== "bar")
@endif
`;
        assert.strictEqual(await formatBladeString(template), out);
    });
});