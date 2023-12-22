import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_summaries_range_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_summaries_range_blade_php', async () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes(), escape: false)->class(['filament-tables-range-summary text-sm px-4 py-3']) }}>
    @php
        $state = $formatState($getState());
        $from = $state[0] ?? null;
        $to = $state[1] ?? null;
    @endphp

    @if (filled($label = $getLabel()))
        <span class="text-gray-500 dark:text-gray-400">
            {{ $label }}:
        </span>
    @endif

    <span>
        {{ $from }}
    </span>

    @if (filled($from) && filled($to))
        <span class="text-gray-500 dark:text-gray-400">
            -
        </span>
    @endif

    <span>
        {{ $to }}
    </span>
</div>
`;
        const output = `<div
    {{ $attributes->merge($getExtraAttributes(), escape: false)->class(['filament-tables-range-summary px-4 py-3 text-sm']) }}
>
    @php
        $state = $formatState($getState());
        $from = $state[0] ?? null;
        $to = $state[1] ?? null;
    @endphp

    @if (filled($label = $getLabel()))
        <span class="text-gray-500 dark:text-gray-400">{{ $label }}:</span>
    @endif

    <span>
        {{ $from }}
    </span>

    @if (filled($from) && filled($to))
        <span class="text-gray-500 dark:text-gray-400">-</span>
    @endif

    <span>
        {{ $to }}
    </span>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});