import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_widgets_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_widgets_blade_php', async () => {
        const input = `@props([
    'columns' => [
        'lg' => 2,
    ],
    'data' => [],
    'widgets' => [],
])

<x-filament-support::grid
    :default="$columns['default'] ?? 1"
    :sm="$columns['sm'] ?? null"
    :md="$columns['md'] ?? null"
    :lg="$columns['lg'] ?? ($columns ? (is_array($columns) ? null : $columns) : 2)"
    :xl="$columns['xl'] ?? null"
    :two-xl="$columns['2xl'] ?? null"
    class="filament-widgets-container gap-4 lg:gap-8 mb-6"
>
    @foreach ($widgets as $widget)
        @if ($widget::canView())
            @livewire(\\Livewire\\Livewire::getAlias($widget), $data, key($widget))
        @endif
    @endforeach
</x-filament-support::grid>
`;
        const output = `@props([
    'columns' => [
        'lg' => 2,
    ],
    'data' => [],
    'widgets' => [],
])

<x-filament-support::grid
    :default="$columns['default'] ?? 1"
    :sm="$columns['sm'] ?? null"
    :md="$columns['md'] ?? null"
    :lg="$columns['lg'] ?? ($columns ? (is_array($columns) ? null : $columns) : 2)"
    :xl="$columns['xl'] ?? null"
    :two-xl="$columns['2xl'] ?? null"
    class="filament-widgets-container mb-6 gap-4 lg:gap-8"
>
    @foreach ($widgets as $widget)
        @if ($widget::canView())
            @livewire(\\Livewire\\Livewire::getAlias($widget), $data, key($widget))
        @endif
    @endforeach
</x-filament-support::grid>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});