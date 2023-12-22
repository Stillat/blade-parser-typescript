import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_field_wrapper_error_message_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_field_wrapper_error_message_blade_php', async () => {
        const input = `<p
    data-validation-error
    {{ $attributes->class([
        'filament-forms-field-wrapper-error-message text-sm text-danger-600 dark:text-danger-400',
    ]) }}
>
    {{ $slot }}
</p>
`;
        const output = `<p
    data-validation-error
    {{
        $attributes->class([
            'filament-forms-field-wrapper-error-message text-danger-600 dark:text-danger-400 text-sm',
        ])
    }}
>
    {{ $slot }}
</p>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});