import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_card_blade_php', () => {
    test('pint: it can format forms_resources_views_components_card_blade_php', () => {
        const input = `<div
    {!! $getId() ? "id=\\"{$getId()}\\"" : null !!}
    {{
        $attributes->merge($getExtraAttributes())->class([
            'filament-forms-card-component p-6 bg-white rounded-xl border border-gray-300',
            'dark:border-gray-600 dark:bg-gray-800' => config('forms.dark_mode'),
        ])
    }}
>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `<div
    {!! $getId() ? "id=\\"{$getId()}\\"" : null !!}
    {{
        $attributes->merge($getExtraAttributes())->class([
            'filament-forms-card-component p-6 bg-white rounded-xl border border-gray-300',
            'dark:border-gray-600 dark:bg-gray-800' => config('forms.dark_mode'),
        ])
    }}
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});