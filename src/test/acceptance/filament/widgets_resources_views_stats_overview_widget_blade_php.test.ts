import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: widgets_resources_views_stats_overview_widget_blade_php', () => {
    setupTestHooks();
    test('pint: it can format widgets_resources_views_stats_overview_widget_blade_php', async () => {
        const input = `<x-filament-widgets::widget class="filament-stats-overview-widget">
    <div @if ($pollingInterval = $this->getPollingInterval()) wire:poll.{{ $pollingInterval }} @endif>
        @php
            $columns = $this->getColumns();
        @endphp

        <div @class([
            'filament-stats grid gap-4 lg:gap-8',
            'md:grid-cols-3' => $columns === 3,
            'md:grid-cols-1' => $columns === 1,
            'md:grid-cols-2' => $columns === 2,
            'md:grid-cols-2 xl:grid-cols-4' => $columns === 4,
        ])>
            @foreach ($this->getCachedCards() as $card)
                {{ $card }}
            @endforeach
        </div>
    </div>
</x-filament-widgets::widget>
`;
        const output = `<x-filament-widgets::widget class="filament-stats-overview-widget">
    <div
        @if ($pollingInterval = $this->getPollingInterval()) wire:poll.{{ $pollingInterval }} @endif
    >
        @php
            $columns = $this->getColumns();
        @endphp

        <div
            @class([
                'filament-stats grid gap-4 lg:gap-8',
                'md:grid-cols-3' => $columns === 3,
                'md:grid-cols-1' => $columns === 1,
                'md:grid-cols-2' => $columns === 2,
                'md:grid-cols-2 xl:grid-cols-4' => $columns === 4,
            ])
        >
            @foreach ($this->getCachedCards() as $card)
                {{ $card }}
            @endforeach
        </div>
    </div>
</x-filament-widgets::widget>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});