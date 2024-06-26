import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_entry_wrapper_hint_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_entry_wrapper_hint_blade_php', async () => {
        const input = `@props([
    'actions' => [],
    'color' => null,
    'icon' => null,
])

<div {{ $attributes->class([
    'filament-infolists-entry-wrapper-hint flex items-center space-x-2 rtl:space-x-reverse',
    match ($color) {
        'danger' => 'text-danger-500 dark:text-danger-300',
        'gray', null => 'text-gray-500 dark:text-gray-300',
        'info' => 'text-info-500 dark:text-info-300',
        'primary' => 'text-primary-500 dark:text-primary-300',
        'secondary' => 'text-secondary-500 dark:text-secondary-300',
        'success' => 'text-success-500 dark:text-success-300',
        'warning' => 'text-warning-500 dark:text-warning-300',
        default => $color,
    },
]) }}>
    @if ($slot->isNotEmpty())
        <span class="text-xs leading-tight">
            {{ $slot }}
        </span>
    @endif

    @if ($icon)
        <x-filament::icon
            :name="$icon"
            alias="filament-infolists::entry-wrapper.hint"
            size="h-5 w-5"
        />
    @endif

    @if (count($actions))
        <div class="filament-infolists-entry-wrapper-hint-action flex gap-1 items-center">
            @foreach ($actions as $action)
                {{ $action }}
            @endforeach
        </div>
    @endif
</div>
`;
        const output = `@props([
    'actions' => [],
    'color' => null,
    'icon' => null,
])

<div
    {{
        $attributes->class([
            'filament-infolists-entry-wrapper-hint flex items-center space-x-2 rtl:space-x-reverse',
            match ($color) {
                'danger' => 'text-danger-500 dark:text-danger-300',
                'gray', null => 'text-gray-500 dark:text-gray-300',
                'info' => 'text-info-500 dark:text-info-300',
                'primary' => 'text-primary-500 dark:text-primary-300',
                'secondary' => 'text-secondary-500 dark:text-secondary-300',
                'success' => 'text-success-500 dark:text-success-300',
                'warning' => 'text-warning-500 dark:text-warning-300',
                default => $color,
            },
        ])
    }}
>
    @if ($slot->isNotEmpty())
        <span class="text-xs leading-tight">
            {{ $slot }}
        </span>
    @endif

    @if ($icon)
        <x-filament::icon
            :name="$icon"
            alias="filament-infolists::entry-wrapper.hint"
            size="h-5 w-5"
        />
    @endif

    @if (count($actions))
        <div
            class="filament-infolists-entry-wrapper-hint-action flex items-center gap-1"
        >
            @foreach ($actions as $action)
                {{ $action }}
            @endforeach
        </div>
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});