import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_widgets_stats_overview_widget_card_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_widgets_stats_overview_widget_card_blade_php', async () => {
        const input = `@php
    $url = $getUrl();
@endphp

<x-filament::stats.card
    :tag="$url ? 'a' : 'div'"
    :chart="$getChart()"
    :chart-color="$getChartColor()"
    :color="$getColor()"
    :icon="$getIcon()"
    :description="$getDescription()"
    :description-color="$getDescriptionColor()"
    :description-icon="$getDescriptionIcon()"
    :description-icon-position="$getDescriptionIconPosition()"
    :href="$url"
    :target="$shouldOpenUrlInNewTab() ? '_blank' : null"
    :label="$getLabel()"
    :value="$getValue()"
    :extra-attributes="$getExtraAttributes()"
    class="filament-stats-overview-widget-card"
/>
`;
        const output = `@php
    $url = $getUrl();
@endphp

<x-filament::stats.card
    :tag="$url ? 'a' : 'div'"
    :chart="$getChart()"
    :chart-color="$getChartColor()"
    :color="$getColor()"
    :icon="$getIcon()"
    :description="$getDescription()"
    :description-color="$getDescriptionColor()"
    :description-icon="$getDescriptionIcon()"
    :description-icon-position="$getDescriptionIconPosition()"
    :href="$url"
    :target="$shouldOpenUrlInNewTab() ? '_blank' : null"
    :label="$getLabel()"
    :value="$getValue()"
    :extra-attributes="$getExtraAttributes()"
    class="filament-stats-overview-widget-card"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});