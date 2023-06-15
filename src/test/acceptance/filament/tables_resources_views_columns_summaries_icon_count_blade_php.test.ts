import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_columns_summaries_icon_count_blade_php', () => {
    test('pint: it can format tables_resources_views_columns_summaries_icon_count_blade_php', () => {
        const input = `<div {{ $attributes->merge($getExtraAttributes(), escape: false)->class(['filament-tables-icon-count-summary text-sm space-y-1 px-4 py-3']) }}>
    @if (filled($label = $getLabel()))
        <p class="text-gray-500 dark:text-gray-400">
            {{ $label }}:
        </p>
    @endif

    @foreach ($getState() as $color => $icons)
        @foreach ($icons as $icon => $count)
            @if ($icon)
                <div class="flex items-center space-x-1">
                    <span>
                        {{ $count }}
                    </span>

                    <span class="text-gray-500 dark:text-gray-400">
                        &times;
                    </span>

                    <x-filament::icon
                        :name="$icon"
                        alias="filament-tables::columns.summaries.icon-count"
                        :color="match ($color) {
                            'danger' => 'text-danger-500',
                            'gray', null => 'text-gray-500',
                            'info' => 'text-info-500',
                            'primary' => 'text-primary-500',
                            'secondary' => 'text-secondary-500',
                            'success' => 'text-success-500',
                            'warning' => 'text-warning-500',
                            default => $color,
                        }"
                        size="h-4 w-4"
                    />
                </div>
            @endif
        @endforeach
    @endforeach
</div>
`;
        const output = `<div
    {{ $attributes->merge($getExtraAttributes(), escape: false)->class(['filament-tables-icon-count-summary space-y-1 px-4 py-3 text-sm']) }}
>
    @if (filled($label = $getLabel()))
        <p class="text-gray-500 dark:text-gray-400">{{ $label }}:</p>
    @endif

    @foreach ($getState() as $color => $icons)
        @foreach ($icons as $icon => $count)
            @if ($icon)
                <div class="flex items-center space-x-1">
                    <span>
                        {{ $count }}
                    </span>

                    <span class="text-gray-500 dark:text-gray-400">
                        &times;
                    </span>

                    <x-filament::icon
                        :name="$icon"
                        alias="filament-tables::columns.summaries.icon-count"
                        :color="
                            match ($color) {
                                'danger' => 'text-danger-500',
                                'gray', null => 'text-gray-500',
                                'info' => 'text-info-500',
                                'primary' => 'text-primary-500',
                                'secondary' => 'text-secondary-500',
                                'success' => 'text-success-500',
                                'warning' => 'text-warning-500',
                                default => $color,
                            }
                        "
                        size="h-4 w-4"
                    />
                </div>
            @endif
        @endforeach
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});