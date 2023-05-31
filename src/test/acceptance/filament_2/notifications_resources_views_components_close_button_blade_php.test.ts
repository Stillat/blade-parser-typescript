import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: notifications_resources_views_components_close_button_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_close_button_blade_php', () => {
        const input = `<x-heroicon-s-x
    class="filament-notifications-close-button h-4 w-4 cursor-pointer text-gray-400"
    x-on:click="close"
/>
`;
        const output = `<x-heroicon-s-x
    class="filament-notifications-close-button h-4 w-4 cursor-pointer text-gray-400"
    x-on:click="close"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});