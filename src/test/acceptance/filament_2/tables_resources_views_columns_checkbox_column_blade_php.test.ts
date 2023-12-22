import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_checkbox_column_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_checkbox_column_blade_php', async () => {
        const input = `@php
    $state = $getState();
@endphp

<div
    x-data="{
        error: undefined,
        state: @js((bool) $state),
        isLoading: false,
    }"
    x-init="
        Livewire.hook('message.processed', (component) => {
            if (component.component.id !== @js($this->id)) {
                return
            }

            if (! $refs.newState) {
                return
            }

            let newState = $refs.newState.value === '1' ? true : false

            if (state === newState) {
                return
            }

            state = newState
        })
    "
    {{ $attributes->merge($getExtraAttributes())->class([
        'filament-tables-checkbox-column',
    ]) }}
>
    <input
        type="hidden"
        value="{{ $state ? 1 : 0 }}"
        x-ref="newState"
    />

    <input
        x-model="state"
        {!! $isDisabled() ? 'disabled' : null !!}
        type="checkbox"
        x-on:change="
            isLoading = true
            response = await $wire.updateTableColumnState(@js($getName()), @js($recordKey), $event.target.checked)
            error = response?.error ?? undefined
            isLoading = false
        "
        x-tooltip="error"
        {{
            $attributes
                ->merge($getExtraInputAttributeBag()->getAttributes())
                ->class([
                    'ml-4 text-primary-600 transition duration-75 rounded shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-70',
                    'dark:bg-gray-700 dark:checked:bg-primary-500' => config('forms.dark_mode'),
                ])
        }}
        x-bind:class="{
            'opacity-70 pointer-events-none': isLoading,
            'border-gray-300': ! error,
            'dark:border-gray-600': (! error) && @js(config('forms.dark_mode')),
            'border-danger-600 ring-1 ring-inset ring-danger-600': error,
        }"
    />
</div>
`;
        const output = `@php
    $state = $getState();
@endphp

<div
    x-data="{
        error: undefined,
        state: @js((bool) $state),
        isLoading: false,
    }"
    x-init="
        Livewire.hook('message.processed', (component) => {
            if (component.component.id !== @js($this->id)) {
                return
            }

            if (! $refs.newState) {
                return
            }

            let newState = $refs.newState.value === '1' ? true : false

            if (state === newState) {
                return
            }

            state = newState
        })
    "
    {{
        $attributes->merge($getExtraAttributes())->class([
            'filament-tables-checkbox-column',
        ])
    }}
>
    <input type="hidden" value="{{ $state ? 1 : 0 }}" x-ref="newState" />

    <input
        x-model="state"
        {!! $isDisabled() ? 'disabled' : null !!}
        type="checkbox"
        x-on:change="
            isLoading = true
            response = await $wire.updateTableColumnState(
                @js($getName()),
                @js($recordKey),
                $event.target.checked,
            )
            error = response?.error ?? undefined
            isLoading = false
        "
        x-tooltip="error"
        {{
            $attributes
                ->merge($getExtraInputAttributeBag()->getAttributes())
                ->class([
                    'text-primary-600 focus:border-primary-500 focus:ring-primary-500 ml-4 rounded shadow-sm outline-none transition duration-75 focus:ring-2 disabled:opacity-70',
                    'dark:checked:bg-primary-500 dark:bg-gray-700' => config('forms.dark_mode'),
                ])
        }}
        x-bind:class="{
            'opacity-70 pointer-events-none': isLoading,
            'border-gray-300': ! error,
            'dark:border-gray-600': ! error && @js(config('forms.dark_mode')),
            'border-danger-600 ring-1 ring-inset ring-danger-600': error,
        }"
    />
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});