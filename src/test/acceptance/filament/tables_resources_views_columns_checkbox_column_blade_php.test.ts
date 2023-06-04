import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_columns_checkbox_column_blade_php', () => {
    test('pint: it can format tables_resources_views_columns_checkbox_column_blade_php', () => {
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
    {{ $attributes->merge($getExtraAttributes(), escape: false)->class([
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
        @disabled($isDisabled())
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
                ->merge($getExtraInputAttributes(), escape: false)
                ->class(['ms-4 text-primary-600 transition duration-75 rounded shadow-sm text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-70 dark:bg-gray-700 dark:checked:bg-primary-500'])
        }}
        x-bind:class="{
            'opacity-70 pointer-events-none': isLoading,
            'border-gray-300 dark:border-gray-600': ! error,
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
        $attributes->merge($getExtraAttributes(), escape: false)->class([
            'filament-tables-checkbox-column',
        ])
    }}
>
    <input type="hidden" value="{{ $state ? 1 : 0 }}" x-ref="newState" />

    <input
        x-model="state"
        @disabled($isDisabled())
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
                ->merge($getExtraInputAttributes(), escape: false)
                ->class(['text-primary-600 focus:border-primary-500 focus:ring-primary-500 dark:checked:bg-primary-500 ms-4 rounded text-sm shadow-sm outline-none transition duration-75 focus:ring-2 disabled:opacity-70 dark:bg-gray-700'])
        }}
        x-bind:class="{
            'opacity-70 pointer-events-none': isLoading,
            'border-gray-300 dark:border-gray-600': ! error,
            'border-danger-600 ring-1 ring-inset ring-danger-600': error,
        }"
    />
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});