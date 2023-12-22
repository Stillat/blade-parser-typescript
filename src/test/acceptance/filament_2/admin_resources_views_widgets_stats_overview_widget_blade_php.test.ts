import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_widgets_stats_overview_widget_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_widgets_stats_overview_widget_blade_php', async () => {
        const input = `<x-filament::widget class="filament-stats-overview-widget">
    <div {!! ($pollingInterval = $this->getPollingInterval()) ? "wire:poll.{$pollingInterval}" : '' !!}>
        <x-filament::stats :columns="$this->getColumns()">
            @foreach ($this->getCachedCards() as $card)
                {{ $card }}
            @endforeach
        </x-filament::stats>
    </div>
</x-filament::widget>
`;
        const output = `<x-filament::widget class="filament-stats-overview-widget">
    <div
        {!! ($pollingInterval = $this->getPollingInterval()) ? "wire:poll.{$pollingInterval}" : '' !!}
    >
        <x-filament::stats :columns="$this->getColumns()">
            @foreach ($this->getCachedCards() as $card)
                {{ $card }}
            @endforeach
        </x-filament::stats>
    </div>
</x-filament::widget>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});