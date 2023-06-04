import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_rich_editor_toolbar_button_blade_php', () => {
    test('pint: it can format forms_resources_views_components_rich_editor_toolbar_button_blade_php', () => {
        const input = `<button {{ $attributes
    ->merge([
        'type' => 'button',
    ], escape: false)
    ->class(['filament-forms-rich-editor-component-toolbar-button h-full border-gray-300 bg-white text-gray-800 text-sm py-1 px-3 cursor-pointer font-medium border rounded-lg transition duration-200 shadow-sm hover:bg-gray-100 focus:ring-primary-200 focus:ring focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'])
}}>
    {{ $slot }}
</button>
`;
        const output = `<button
    {{
        $attributes
            ->merge([
                'type' => 'button',
            ], escape: false)
            ->class(['filament-forms-rich-editor-component-toolbar-button focus:ring-primary-200 h-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-800 shadow-sm transition duration-200 hover:bg-gray-100 focus:ring focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white'])
    }}
>
    {{ $slot }}
</button>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});