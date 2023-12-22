import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_reorder_trigger_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_reorder_trigger_blade_php', async () => {
        const input = `@props([
    'enabled' => false,
])

<x-tables::icon-button
    wire:click="toggleTableReordering"
    :icon="$enabled ? 'heroicon-o-check' : 'heroicon-o-selector'"
    :label="$enabled ? __('tables::table.buttons.disable_reordering.label') : __('tables::table.buttons.enable_reordering.label')"
    {{ $attributes->class(['filament-tables-reordering-trigger']) }}
/>
`;
        const output = `@props([
    'enabled' => false,
])

<x-tables::icon-button
    wire:click="toggleTableReordering"
    :icon="$enabled ? 'heroicon-o-check' : 'heroicon-o-selector'"
    :label="$enabled ? __('tables::table.buttons.disable_reordering.label') : __('tables::table.buttons.enable_reordering.label')"
    {{ $attributes->class(['filament-tables-reordering-trigger']) }}
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});