import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_fieldset_blade_php', () => {
    test('pint: it can format forms_resources_views_components_fieldset_blade_php', () => {
        const input = `<fieldset
    {!! $getId() ? "id=\\"{$getId()}\\"" : null !!}
    {{
        $attributes->merge($getExtraAttributes())->class([
            'filament-forms-fieldset-component rounded-xl shadow-sm border border-gray-300 p-6',
            'dark:border-gray-600 dark:text-gray-200' => config('forms.dark_mode'),
        ])
    }}
>
    @if (filled($label = $getLabel()))
        <legend class="text-sm leading-tight font-medium px-2 -ml-2">
            {{ $label }}
        </legend>
    @endif

    {{ $getChildComponentContainer() }}
</fieldset>
`;
        const output = `<fieldset
    {!! $getId() ? "id=\\"{$getId()}\\"" : null !!}
    {{
        $attributes->merge($getExtraAttributes())->class([
            'filament-forms-fieldset-component rounded-xl shadow-sm border border-gray-300 p-6',
            'dark:border-gray-600 dark:text-gray-200' => config('forms.dark_mode'),
        ])
    }}
>
    @if (filled($label = $getLabel()))
        <legend class="text-sm leading-tight font-medium px-2 -ml-2">
            {{ $label }}
        </legend>
    @endif

    {{ $getChildComponentContainer() }}
</fieldset>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});