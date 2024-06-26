import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: widgets_resources_views_components_widget_blade_php', () => {
    setupTestHooks();
    test('pint: it can format widgets_resources_views_components_widget_blade_php', async () => {
        const input = `@php
    $columnSpan = $this->getColumnSpan();

    if (! is_array($columnSpan)) {
        $columnSpan = [
            'default' => $columnSpan,
        ];
    }

    $columnStart = $this->getColumnStart();

    if (! is_array($columnStart)) {
        $columnStart = [
            'default' => $columnStart,
        ];
    }
@endphp

<x-filament::grid.column
    :default="$columnSpan['default'] ?? 1"
    :sm="$columnSpan['sm'] ?? null"
    :md="$columnSpan['md'] ?? null"
    :lg="$columnSpan['lg'] ?? null"
    :xl="$columnSpan['xl'] ?? null"
    :twoXl="$columnSpan['2xl'] ?? null"
    :defaultStart="$columnStart['default'] ?? null"
    :smStart="$columnStart['sm'] ?? null"
    :mdStart="$columnStart['md'] ?? null"
    :lgStart="$columnStart['lg'] ?? null"
    :xlStart="$columnStart['xl'] ?? null"
    :twoXlStart="$columnStart['2xl'] ?? null"
    class="filament-widget"
>
    {{ $slot }}
</x-filament::grid.column>
`;
        const output = `@php
    $columnSpan = $this->getColumnSpan();

    if (! is_array($columnSpan)) {
        $columnSpan = [
            'default' => $columnSpan,
        ];
    }

    $columnStart = $this->getColumnStart();

    if (! is_array($columnStart)) {
        $columnStart = [
            'default' => $columnStart,
        ];
    }
@endphp

<x-filament::grid.column
    :default="$columnSpan['default'] ?? 1"
    :sm="$columnSpan['sm'] ?? null"
    :md="$columnSpan['md'] ?? null"
    :lg="$columnSpan['lg'] ?? null"
    :xl="$columnSpan['xl'] ?? null"
    :twoXl="$columnSpan['2xl'] ?? null"
    :defaultStart="$columnStart['default'] ?? null"
    :smStart="$columnStart['sm'] ?? null"
    :mdStart="$columnStart['md'] ?? null"
    :lgStart="$columnStart['lg'] ?? null"
    :xlStart="$columnStart['xl'] ?? null"
    :twoXlStart="$columnStart['2xl'] ?? null"
    class="filament-widget"
>
    {{ $slot }}
</x-filament::grid.column>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});