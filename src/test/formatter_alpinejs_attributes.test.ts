import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Alpine.js attribute formatting', () => {
    test('it does not trash formatting of embedded php', () => {
        const input = `
<button x-data="var thing = '<?php !$someoneWillDoThis ?> <?= $moreStuff ?>'"></button>
`;
        const out = `<button
    x-data="var thing = '<?php !$someoneWillDoThis ?> <?= $moreStuff ?>'"
></button>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

});