import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_columns_summaries_text_blade_php', () => {
    test('pint: it can format tables_resources_views_columns_summaries_text_blade_php', () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes(), escape: false)->class(['filament-tables-text-summary text-sm px-4 py-3']) }}>
    @if (filled($label = $getLabel()))
        <span class="text-gray-500 dark:text-gray-400">
            {{ $label }}:
        </span>
    @endif

    <span>
        {{ $formatState($getState()) }}
    </span>
</div>
`;
        const output = `<div
    {{ $attributes->merge($getExtraAttributes(), escape: false)->class(['filament-tables-text-summary text-sm px-4 py-3']) }}
>
    @if (filled($label = $getLabel()))
        <span class="text-gray-500 dark:text-gray-400">{{ $label }}:</span>
    @endif

    <span>
        {{ $formatState($getState()) }}
    </span>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});