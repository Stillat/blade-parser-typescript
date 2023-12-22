import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_layout_grid_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_layout_grid_blade_php', async () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes()) }}>
    @php
        $columns = $getGridColumns();
    @endphp

    <x-filament-support::grid
        :default="$columns['default'] ?? 1"
        :sm="$columns['sm'] ?? null"
        :md="$columns['md'] ?? null"
        :lg="$columns['lg'] ?? null"
        :xl="$columns['xl'] ?? null"
        :two-xl="$columns['2xl'] ?? null"
        :class="\\Illuminate\\Support\\Arr::toCssClasses([
            (($columns['default'] ?? 1) === 1) ? 'gap-1' : 'gap-3',
            ($columns['sm'] ?? null) ? (($columns['sm'] === 1) ? 'sm:gap-1' : 'sm:gap-3') : null,
            ($columns['md'] ?? null) ? (($columns['md'] === 1) ? 'md:gap-1' : 'md:gap-3') : null,
            ($columns['lg'] ?? null) ? (($columns['lg'] === 1) ? 'lg:gap-1' : 'lg:gap-3') : null,
            ($columns['xl'] ?? null) ? (($columns['xl'] === 1) ? 'xl:gap-1' : 'xl:gap-3') : null,
            ($columns['2xl'] ?? null) ? (($columns['2xl'] === 1) ? '2xl:gap-1' : '2xl:gap-3') : null,
        ])"
    >
        <x-tables::columns.layout
            :components="$getComponents()"
            :record="$getRecord()"
            :record-key="$recordKey"
            grid
        />
    </x-filament-support::grid>
</div>
`;
        const output = `<div {{ $attributes->merge($getExtraAttributes()) }}>
    @php
        $columns = $getGridColumns();
    @endphp

    <x-filament-support::grid
        :default="$columns['default'] ?? 1"
        :sm="$columns['sm'] ?? null"
        :md="$columns['md'] ?? null"
        :lg="$columns['lg'] ?? null"
        :xl="$columns['xl'] ?? null"
        :two-xl="$columns['2xl'] ?? null"
        :class="
            \\Illuminate\\Support\\Arr::toCssClasses([
                (($columns['default'] ?? 1) === 1) ? 'gap-1' : 'gap-3',
                ($columns['sm'] ?? null) ? (($columns['sm'] === 1) ? 'sm:gap-1' : 'sm:gap-3') : null,
                ($columns['md'] ?? null) ? (($columns['md'] === 1) ? 'md:gap-1' : 'md:gap-3') : null,
                ($columns['lg'] ?? null) ? (($columns['lg'] === 1) ? 'lg:gap-1' : 'lg:gap-3') : null,
                ($columns['xl'] ?? null) ? (($columns['xl'] === 1) ? 'xl:gap-1' : 'xl:gap-3') : null,
                ($columns['2xl'] ?? null) ? (($columns['2xl'] === 1) ? '2xl:gap-1' : '2xl:gap-3') : null,
            ])
        "
    >
        <x-tables::columns.layout
            :components="$getComponents()"
            :record="$getRecord()"
            :record-key="$recordKey"
            grid
        />
    </x-filament-support::grid>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});