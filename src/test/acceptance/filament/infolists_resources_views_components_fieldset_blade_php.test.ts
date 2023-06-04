import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: infolists_resources_views_components_fieldset_blade_php', () => {
    test('pint: it can format infolists_resources_views_components_fieldset_blade_php', () => {
        const input = `<fieldset {{
    $attributes
        ->merge([
            'id' => $getId(),
        ], escape: false)
        ->merge($getExtraAttributes(), escape: false)
        ->class(['filament-infolists-fieldset-component rounded-xl shadow-sm border border-gray-300 p-6 dark:border-gray-600 dark:text-gray-200'])
}}>
    <legend class="text-sm leading-tight font-medium px-2 -ms-2">
        {{ $getLabel() }}
    </legend>

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
            ->class(['filament-infolists-fieldset-component rounded-xl border border-gray-300 p-6 shadow-sm dark:border-gray-600 dark:text-gray-200'])
    }}
>
    <legend class="-ms-2 px-2 text-sm font-medium leading-tight">
        {{ $getLabel() }}
    </legend>

    {{ $getChildComponentContainer() }}
</fieldset>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});