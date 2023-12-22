import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_components_header_heading_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_components_header_heading_blade_php', async () => {
        const input = `<h1 {{ $attributes->class(['filament-header-heading text-2xl font-bold tracking-tight']) }}>
    {{ $slot }}
</h1>
`;
        const output = `<h1
    {{ $attributes->class(['filament-header-heading text-2xl font-bold tracking-tight']) }}
>
    {{ $slot }}
</h1>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});