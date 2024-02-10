import assert from 'assert';
import { formatBladeString, formatAsHtml } from '../formatting/prettier/utils.js';

suite('General HTML Formatting', () => {
    test('it should format short HTML snippets the same as the core formatter', async () => {
        const template = `<a target='_blank' href='/arbitrary-path/to-a-file'>Lorem ipsum dolor sit amet, consectetur</a>`;
        const out = `<a target="_blank" href="/arbitrary-path/to-a-file"
  >Lorem ipsum dolor sit amet, consectetur</a
>
`;

        assert.strictEqual(await formatAsHtml(template), out, 'The fixture should match the output of the HTML formatter.');
        assert.strictEqual(await formatBladeString(template), out);
    });

    test('it should format long HTML snippets the same as the core formatter', async () => {
        const template = `<ul>
    <li><strong>Lorem ipsum dolor sit amet, consectetur</strong> adipiscing elit, <a href="https://subdomain.example.com/sed/do-eiusmod/" target="_blank">tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis</a>. Nostrud <a href="https://subdomain.example.com/exercitation/ullamco-laboris/" target="_blank">Nisi ut aliquip ex ea commodo</a>.</li>
</ul>
`;
        const out = `<ul>
  <li>
    <strong>Lorem ipsum dolor sit amet, consectetur</strong> adipiscing elit,
    <a href="https://subdomain.example.com/sed/do-eiusmod/" target="_blank"
      >tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis</a
    >. Nostrud
    <a
      href="https://subdomain.example.com/exercitation/ullamco-laboris/"
      target="_blank"
      >Nisi ut aliquip ex ea commodo</a
    >.
  </li>
</ul>
`;

        assert.strictEqual(await formatAsHtml(template), out, 'The fixture should match the output of the HTML formatter.');
        assert.strictEqual(await formatBladeString(template), out);
    });
});
