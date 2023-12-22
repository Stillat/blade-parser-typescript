import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_entry_wrapper_label_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_entry_wrapper_label_blade_php', async () => {
        const input = `@props([
    'prefix' => null,
    'suffix' => null,
])

<dt {{ $attributes->class(['filament-infolists-entry-wrapper-label inline-flex items-center space-x-3 rtl:space-x-reverse']) }}>
    {{ $prefix }}

    <span class="text-sm text-gray-500 font-medium leading-4 dark:text-gray-400">
        {{ $slot }}
    </span>

    {{ $suffix }}
</dt>
`;
        const output = `@props([
    'prefix' => null,
    'suffix' => null,
])

<dt
    {{ $attributes->class(['filament-infolists-entry-wrapper-label inline-flex items-center space-x-3 rtl:space-x-reverse']) }}
>
    {{ $prefix }}

    <span
        class="text-sm font-medium leading-4 text-gray-500 dark:text-gray-400"
    >
        {{ $slot }}
    </span>

    {{ $suffix }}
</dt>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});