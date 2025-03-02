import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: notifications_resources_views_components_icon_blade_php', () => {
    setupTestHooks();
    test('pint: it can format notifications_resources_views_components_icon_blade_php', async () => {
        const input = `@props([
    'color' => null,
    'name',
    'size' => 'lg',
])

<x-filament::icon
    :name="$name"
    alias="filament-notifications::notification"
    :color="match ($color) {
        'danger' => 'text-danger-400',
        'gray', null => 'text-gray-400',
        'info' => 'text-info-400',
        'primary' => 'text-primary-400',
        'secondary' => 'text-secondary-400',
        'success' => 'text-success-400',
        'warning' => 'text-warning-400',
        default => $color,
    }"
    :size="match ($size) {
        'sm' => 'h-4 w-4',
        'md' => 'h-5 w-5',
        'lg' => 'h-6 w-6',
        default => $size,
    }"
    class="filament-notifications-notification-icon"
/>
`;
        const output = `@props([
    'color' => null,
    'name',
    'size' => 'lg',
])

<x-filament::icon
    :name="$name"
    alias="filament-notifications::notification"
    :color="
        match ($color) {
            'danger' => 'text-danger-400',
            'gray', null => 'text-gray-400',
            'info' => 'text-info-400',
            'primary' => 'text-primary-400',
            'secondary' => 'text-secondary-400',
            'success' => 'text-success-400',
            'warning' => 'text-warning-400',
            default => $color,
        }
    "
    :size="
        match ($size) {
            'sm' => 'h-4 w-4',
            'md' => 'h-5 w-5',
            'lg' => 'h-6 w-6',
            default => $size,
        }
    "
    class="filament-notifications-notification-icon"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});