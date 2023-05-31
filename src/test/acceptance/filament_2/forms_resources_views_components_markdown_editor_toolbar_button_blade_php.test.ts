import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: forms_resources_views_components_markdown_editor_toolbar_button_blade_php', () => {
    test('pint: it can format forms_resources_views_components_markdown_editor_toolbar_button_blade_php', () => {
        const input = `<button
    x-bind:disabled="tab === 'preview'"
    type="button"
    {{
        $attributes->class([
            'filament-forms-markdown-editor-component-toolbar-button h-full border-gray-300 bg-white text-gray-800 text-sm py-1 px-3 cursor-pointer font-medium border rounded-lg transition duration-200 shadow-sm hover:bg-gray-100 focus:ring-primary-200 focus:ring focus:ring-opacity-50',
            'dark:bg-gray-700 dark:border-gray-600 dark:text-white' => config('forms.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</button>
`;
        const output = `<button
    x-bind:disabled="tab === 'preview'"
    type="button"
    {{
        $attributes->class([
            'filament-forms-markdown-editor-component-toolbar-button h-full border-gray-300 bg-white text-gray-800 text-sm py-1 px-3 cursor-pointer font-medium border rounded-lg transition duration-200 shadow-sm hover:bg-gray-100 focus:ring-primary-200 focus:ring focus:ring-opacity-50',
            'dark:bg-gray-700 dark:border-gray-600 dark:text-white' => config('forms.dark_mode'),
        ])
    }}
>
    {{ $slot }}
</button>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});