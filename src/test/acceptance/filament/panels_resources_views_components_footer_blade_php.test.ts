import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: panels_resources_views_components_footer_blade_php', () => {
    test('pint: it can format panels_resources_views_components_footer_blade_php', () => {
        const input = `{{ filament()->renderHook('footer.before') }}

<div class="filament-footer flex items-center justify-center">
    {{ filament()->renderHook('footer') }}
</div>

{{ filament()->renderHook('footer.after') }}
`;
        const output = `{{ filament()->renderHook('footer.before') }}

<div class="filament-footer flex items-center justify-center">
    {{ filament()->renderHook('footer') }}
</div>

{{ filament()->renderHook('footer.after') }}
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});