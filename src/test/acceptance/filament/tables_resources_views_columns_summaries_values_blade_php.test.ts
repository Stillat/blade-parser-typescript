import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_summaries_values_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_summaries_values_blade_php', async () => {
        const input = `<div {{ $attributes
    ->merge($getExtraAttributes(), escape: false)
    ->class([
        'filament-tables-values-summary text-sm px-4 py-3 whitespace-normal',
        'prose prose-sm max-w-none dark:prose-invert' => $isBulleted(),
    ])
}}>
    @if (filled($label = $getLabel()))
        <p class="text-gray-500 dark:text-gray-400">
            {{ $label }}:
        </p>
    @endif

    <ul>
        @foreach ($getState() as $stateItem)
            <li>
                {{ $formatState($stateItem) }}
            </li>
        @endforeach
    </ul>
</div>
`;
        const output = `<div
    {{
        $attributes
            ->merge($getExtraAttributes(), escape: false)
            ->class([
                'filament-tables-values-summary whitespace-normal px-4 py-3 text-sm',
                'prose prose-sm dark:prose-invert max-w-none' => $isBulleted(),
            ])
    }}
>
    @if (filled($label = $getLabel()))
        <p class="text-gray-500 dark:text-gray-400">{{ $label }}:</p>
    @endif

    <ul>
        @foreach ($getState() as $stateItem)
            <li>
                {{ $formatState($stateItem) }}
            </li>
        @endforeach
    </ul>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});