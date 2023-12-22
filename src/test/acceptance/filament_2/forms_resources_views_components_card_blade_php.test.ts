import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_card_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_card_blade_php', async () => {
        const input = `<div
    {!! $getId() ? "id=\\"{$getId()}\\"" : null !!}
    {{ $attributes->merge($getExtraAttributes())->class([
        'filament-forms-card-component p-6 bg-white rounded-xl border border-gray-300',
        'dark:border-gray-600 dark:bg-gray-800' => config('forms.dark_mode'),
    ]) }}
>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `<div
    {!! $getId() ? "id=\\"{$getId()}\\"" : null !!}
    {{
        $attributes->merge($getExtraAttributes())->class([
            'filament-forms-card-component rounded-xl border border-gray-300 bg-white p-6',
            'dark:border-gray-600 dark:bg-gray-800' => config('forms.dark_mode'),
        ])
    }}
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});