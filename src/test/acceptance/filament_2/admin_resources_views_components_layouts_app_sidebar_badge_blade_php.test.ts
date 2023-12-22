import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_layouts_app_sidebar_badge_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_layouts_app_sidebar_badge_blade_php', async () => {
        const input = `@props([
    'active' => false,
    'badge' => null,
    'badgeColor' => null,
])

<span
    @if (config('filament.layout.sidebar.is_collapsible_on_desktop'))
        x-show="$store.sidebar.isOpen"
    @endif
    @class(
        array_merge(
            [
                'inline-flex items-center justify-center ml-auto rtl:ml-0 rtl:mr-auto min-h-4 px-2 py-0.5 text-xs font-medium tracking-tight rounded-xl whitespace-normal',
                'text-white bg-white/20' => $active,
            ],
            match ($badgeColor) {
                'danger' => [
                    'text-danger-700 bg-danger-500/10' => ! $active,
                    'dark:text-danger-500' => (! $active) && config('tables.dark_mode'),
                ],
                'secondary' => [
                    'text-gray-700 bg-gray-500/10' => ! $active,
                    'dark:text-gray-500' => (! $active) && config('tables.dark_mode'),
                ],
                'success' => [
                    'text-success-700 bg-success-500/10' => ! $active,
                    'dark:text-success-500' => (! $active) && config('tables.dark_mode'),
                ],
                'warning' => [
                    'text-warning-700 bg-warning-500/10' => ! $active,
                    'dark:text-warning-500' => (! $active) && config('filament.dark_mode'),
                ],
                'primary', null => [
                    'text-primary-700 bg-primary-500/10' => ! $active,
                    'dark:text-primary-500' => (! $active) && config('tables.dark_mode'),
                ],
                default => [
                    $badgeColor => ! $active,
                ],
            },
        )
    )
>
    {{ $badge }}
</span>
`;
        const output = `@props([
    'active' => false,
    'badge' => null,
    'badgeColor' => null,
])

<span
    @if (config('filament.layout.sidebar.is_collapsible_on_desktop'))
        x-show="$store.sidebar.isOpen"
    @endif
    @class(array_merge(
        [
            'min-h-4 ml-auto inline-flex items-center justify-center whitespace-normal rounded-xl px-2 py-0.5 text-xs font-medium tracking-tight rtl:ml-0 rtl:mr-auto',
            'bg-white/20 text-white' => $active,
        ],
        match ($badgeColor) {
            'danger' => [
                'text-danger-700 bg-danger-500/10' => ! $active,
                'dark:text-danger-500' => (! $active) && config('tables.dark_mode'),
            ],
            'secondary' => [
                'bg-gray-500/10 text-gray-700' => ! $active,
                'dark:text-gray-500' => (! $active) && config('tables.dark_mode'),
            ],
            'success' => [
                'text-success-700 bg-success-500/10' => ! $active,
                'dark:text-success-500' => (! $active) && config('tables.dark_mode'),
            ],
            'warning' => [
                'text-warning-700 bg-warning-500/10' => ! $active,
                'dark:text-warning-500' => (! $active) && config('filament.dark_mode'),
            ],
            'primary', null => [
                'text-primary-700 bg-primary-500/10' => ! $active,
                'dark:text-primary-500' => (! $active) && config('tables.dark_mode'),
            ],
            default => [
                $badgeColor => ! $active,
            ],
        },
    ))
>
    {{ $badge }}
</span>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});