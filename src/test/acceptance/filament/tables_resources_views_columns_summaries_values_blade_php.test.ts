import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_columns_summaries_values_blade_php', () => {
    test('pint: it can format tables_resources_views_columns_summaries_values_blade_php', () => {
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
                'filament-tables-values-summary text-sm px-4 py-3 whitespace-normal',
                'prose prose-sm max-w-none dark:prose-invert' => $isBulleted(),
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});