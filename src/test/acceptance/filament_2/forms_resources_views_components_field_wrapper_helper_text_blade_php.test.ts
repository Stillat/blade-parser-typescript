import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_field_wrapper_helper_text_blade_php', () => {
    test('pint: it can format forms_resources_views_components_field_wrapper_helper_text_blade_php', () => {
        const input = `<div
    {{
        $attributes->class([
            'filament-forms-field-wrapper-helper-text text-sm text-gray-600',
            'dark:text-gray-300' => config('forms.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</div>
`;
        const output = `<div
    {{
        $attributes->class([
            'filament-forms-field-wrapper-helper-text text-sm text-gray-600',
            'dark:text-gray-300' => config('forms.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});