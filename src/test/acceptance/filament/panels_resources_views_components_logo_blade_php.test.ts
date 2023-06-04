import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: panels_resources_views_components_logo_blade_php', () => {
    test('pint: it can format panels_resources_views_components_logo_blade_php', () => {
        const input = `@if (filled($brand = filament()->getBrandName()))
    <div class="filament-brand text-xl font-bold leading-5 tracking-tight dark:text-white">
        {{ $brand }}
    </div>
@endif
`;
        const output = `@if (filled($brand = filament()->getBrandName()))
    <div
        class="filament-brand text-xl font-bold leading-5 tracking-tight dark:text-white"
    >
        {{ $brand }}
    </div>
@endif
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});