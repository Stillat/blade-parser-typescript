import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_pages_actions_select_action_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_pages_actions_select_action_blade_php', async () => {
        const input = `<div class="filament-page-select-action">
    <label for="{{ $getId() }}" class="sr-only">
        {{ $getLabel() }}
    </label>

    <select
        id="{{ $getId() }}"
        wire:model="{{ $getName() }}"
        {{ $attributes->class([
            'text-gray-900 border-gray-300 invalid:text-gray-400 block w-full h-9 py-1 transition duration-75 rounded-lg shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500',
            'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:border-primary-500' => config('filament.dark_mode'),
        ]) }}
    >
        @if (($placeholder = $getPlaceholder()) !== null)
            <option value="">{{ $placeholder }}</option>
        @endif

        @foreach ($getOptions() as $value => $label)
            <option value="{{ $value }}">
                {{ $label }}
            </option>
        @endforeach
    </select>
</div>
`;
        const output = `<div class="filament-page-select-action">
    <label for="{{ $getId() }}" class="sr-only">
        {{ $getLabel() }}
    </label>

    <select
        id="{{ $getId() }}"
        wire:model="{{ $getName() }}"
        {{
            $attributes->class([
                'focus:border-primary-500 focus:ring-primary-500 block h-9 w-full rounded-lg border-gray-300 py-1 text-gray-900 shadow-sm outline-none transition duration-75 invalid:text-gray-400 focus:ring-1 focus:ring-inset',
                'dark:focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200' => config('filament.dark_mode'),
            ])
        }}
    >
        @if (($placeholder = $getPlaceholder()) !== null)
            <option value="">{{ $placeholder }}</option>
        @endif

        @foreach ($getOptions() as $value => $label)
            <option value="{{ $value }}">
                {{ $label }}
            </option>
        @endforeach
    </select>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});