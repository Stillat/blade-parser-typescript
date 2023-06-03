import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_fieldset_blade_php', () => {
    test('pint: it can format forms_resources_views_components_fieldset_blade_php', () => {
        const input = `<fieldset {{
    $attributes
        ->merge([
            'id' => $getId(),
        ], escape: false)
        ->merge($getExtraAttributes(), escape: false)
        ->class(['filament-forms-fieldset-component rounded-xl shadow-sm border border-gray-300 p-6 dark:border-gray-600 dark:text-gray-200'])
}}>
    @if (filled($label = $getLabel()))
        <legend class="text-sm leading-tight font-medium px-2 -ms-2">
            {{ $getLabel() }}
        </legend>
    @endif

    {{ $getChildComponentContainer() }}
</fieldset>
`;
        const output = `<fieldset
    {{
        $attributes
            ->merge([
                'id' => $getId(),
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-forms-fieldset-component rounded-xl shadow-sm border border-gray-300 p-6 dark:border-gray-600 dark:text-gray-200'])
    }}
>
    @if (filled($label = $getLabel()))
        <legend class="-ms-2 px-2 text-sm font-medium leading-tight">
            {{ $getLabel() }}
        </legend>
    @endif

    {{ $getChildComponentContainer() }}
</fieldset>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});