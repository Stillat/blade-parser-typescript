import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_filters_trigger_blade_php', () => {
    test('pint: it can format tables_resources_views_components_filters_trigger_blade_php', () => {
        const input = `@props([
    'indicatorsCount' => null,
])

<x-tables::icon-button
    icon="heroicon-o-filter"
    :label="__('tables::table.buttons.filter.label')"
    :indicator="$indicatorsCount"
    {{ $attributes->class(['filament-tables-filters-trigger']) }}
/>
`;
        const output = `@props([
    'indicatorsCount' => null,
])

<x-tables::icon-button
    icon="heroicon-o-filter"
    :label="__('tables::table.buttons.filter.label')"
    :indicator="$indicatorsCount"
    {{ $attributes->class(['filament-tables-filters-trigger']) }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});