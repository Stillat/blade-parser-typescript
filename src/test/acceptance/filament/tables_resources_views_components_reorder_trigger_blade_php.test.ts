import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: tables_resources_views_components_reorder_trigger_blade_php', () => {
    test('pint: it can format tables_resources_views_components_reorder_trigger_blade_php', () => {
        const input = `@props([
    'enabled' => false,
])

<x-filament::icon-button
    wire:click="toggleTableReordering"
    :icon="$enabled ? 'heroicon-o-check' : 'heroicon-o-chevron-up-down'"
    icon-alias="tables::reordering.trigger"
    :label="$enabled ? __('filament-tables::table.buttons.disable_reordering.label') : __('filament-tables::table.buttons.enable_reordering.label')"
    {{ $attributes->class(['filament-tables-reordering-trigger']) }}
/>
`;
        const output = `@props([
    'enabled' => false,
])

<x-filament::icon-button
    wire:click="toggleTableReordering"
    :icon="$enabled ? 'heroicon-o-check' : 'heroicon-o-chevron-up-down'"
    icon-alias="tables::reordering.trigger"
    :label="$enabled ? __('filament-tables::table.buttons.disable_reordering.label') : __('filament-tables::table.buttons.enable_reordering.label')"
    {{ $attributes->class(['filament-tables-reordering-trigger']) }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});