import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_icon_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_icon_blade_php', async () => {
        const input = `@props([
    'icon',
    'color',
])

<x-dynamic-component
    :component="$icon"
    :class="\\Illuminate\\Support\\Arr::toCssClasses([
        'filament-notifications-icon h-6 w-6',
        match ($color) {
            'success' => 'text-success-400',
            'warning' => 'text-warning-400',
            'danger' => 'text-danger-400',
            'primary' => 'text-primary-400',
            'secondary' => 'text-gray-400',
        },
    ])"
/>
`;
        const output = `@props([
    'icon',
    'color',
])

<x-dynamic-component
    :component="$icon"
    :class="
        \\Illuminate\\Support\\Arr::toCssClasses([
            'filament-notifications-icon h-6 w-6',
            match ($color) {
                'success' => 'text-success-400',
                'warning' => 'text-warning-400',
                'danger' => 'text-danger-400',
                'primary' => 'text-primary-400',
                'secondary' => 'text-gray-400',
            },
        ])
    "
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});