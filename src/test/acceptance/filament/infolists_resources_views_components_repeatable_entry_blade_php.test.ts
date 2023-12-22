import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_repeatable_entry_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_repeatable_entry_blade_php', async () => {
        const input = `<x-dynamic-component
    :component="$getEntryWrapperView()"
    :entry="$entry"
>
    <ul {{
        $attributes
            ->merge([
                'id' => $getId(),
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-infolists-repeatable-entry'])
    }}>
        <x-filament::grid
            :default="$getGridColumns('default')"
            :sm="$getGridColumns('sm')"
            :md="$getGridColumns('md')"
            :lg="$getGridColumns('lg')"
            :xl="$getGridColumns('xl')"
            :two-xl="$getGridColumns('2xl')"
            class="gap-6"
        >
            @foreach ($getChildComponentContainers() as $container)
                <li class="block p-6 rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20">
                    {{ $container }}
                </li>
            @endforeach
        </x-filament::grid>
    </ul>
</x-dynamic-component>
`;
        const output = `<x-dynamic-component :component="$getEntryWrapperView()" :entry="$entry">
    <ul
        {{
            $attributes
                ->merge([
                    'id' => $getId(),
                ], escape: false)
                ->merge($getExtraAttributes(), escape: false)
                ->class(['filament-infolists-repeatable-entry'])
        }}
    >
        <x-filament::grid
            :default="$getGridColumns('default')"
            :sm="$getGridColumns('sm')"
            :md="$getGridColumns('md')"
            :lg="$getGridColumns('lg')"
            :xl="$getGridColumns('xl')"
            :two-xl="$getGridColumns('2xl')"
            class="gap-6"
        >
            @foreach ($getChildComponentContainers() as $container)
                <li
                    class="block rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20"
                >
                    {{ $container }}
                </li>
            @endforeach
        </x-filament::grid>
    </ul>
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});