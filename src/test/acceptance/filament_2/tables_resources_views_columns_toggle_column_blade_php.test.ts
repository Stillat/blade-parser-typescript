import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_columns_toggle_column_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_columns_toggle_column_blade_php', async () => {
        const input = `@php
    $state = $getState();
@endphp

<div wire:key="{{ $this->id }}.table.record.{{ $recordKey }}.column.{{ $getName() }}.toggle-column.{{ $state ? 'true' : 'false' }}">
    <div
        x-data="{
            error: undefined,
            state: @js((bool) $state),
            isLoading: false,
        }"
        {{ $attributes->merge($getExtraAttributes())->class([
            'filament-tables-toggle-column',
        ]) }}
        wire:ignore
    >
        <button
            role="switch"
            aria-checked="false"
            x-bind:aria-checked="state.toString()"
            x-on:click="
                if (isLoading) {
                    return
                }

                state = ! state

                isLoading = true
                response = await $wire.updateTableColumnState(@js($getName()), @js($recordKey), state)
                error = response?.error ?? undefined

                if (error) {
                    state = ! state
                }

                isLoading = false
            "
            x-tooltip="error"
            x-bind:class="{
                'opacity-70 pointer-events-none': isLoading,
                '{{ match ($getOnColor()) {
                    'danger' => 'bg-danger-500',
                    'secondary' => 'bg-gray-500',
                    'success' => 'bg-success-500',
                    'warning' => 'bg-warning-500',
                    default => 'bg-primary-600',
                } }}': state,
                '{{ match ($getOffColor()) {
                    'danger' => 'bg-danger-500',
                    'primary' => 'bg-primary-500',
                    'success' => 'bg-success-500',
                    'warning' => 'bg-warning-500',
                    default => 'bg-gray-200',
                } }} @if (config('forms.dark_mode')) dark:bg-white/10 @endif': ! state,
            }"
            {!! $isDisabled() ? 'disabled' : null !!}
            type="button"
            class="relative inline-flex shrink-0 ml-4 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
            <span
                class="pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 ease-in-out transition duration-200"
                x-bind:class="{
                    'translate-x-5 rtl:-translate-x-5': state,
                    'translate-x-0': ! state,
                }"
            >
                <span
                    class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                    aria-hidden="true"
                    x-bind:class="{
                        'opacity-0 ease-out duration-100': state,
                        'opacity-100 ease-in duration-200': ! state,
                    }"
                >
                    @if ($hasOffIcon())
                        <x-dynamic-component
                            :component="$getOffIcon()"
                            :class="\\Illuminate\\Support\\Arr::toCssClasses([
                                'h-3 w-3',
                                match ($getOffColor()) {
                                    'danger' => 'text-danger-500',
                                    'primary' => 'text-primary-500',
                                    'success' => 'text-success-500',
                                    'warning' => 'text-warning-500',
                                    default => 'text-gray-400',
                                },
                            ])"
                        />
                    @endif
                </span>

                <span
                    class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                    aria-hidden="true"
                    x-bind:class="{
                        'opacity-100 ease-in duration-200': state,
                        'opacity-0 ease-out duration-100': ! state,
                    }"
                >
                    @if ($hasOnIcon())
                        <x-dynamic-component
                            :component="$getOnIcon()"
                            x-cloak
                            :class="\\Illuminate\\Support\\Arr::toCssClasses([
                                'h-3 w-3',
                                match ($getOnColor()) {
                                    'danger' => 'text-danger-500',
                                    'secondary' => 'text-gray-400',
                                    'success' => 'text-success-500',
                                    'warning' => 'text-warning-500',
                                    default => 'text-primary-500',
                                },
                            ])"
                        />
                    @endif
                </span>
            </span>
        </button>
    </div>
</div>
`;
        const output = `@php
    $state = $getState();
@endphp

<div
    wire:key="{{ $this->id }}.table.record.{{ $recordKey }}.column.{{ $getName() }}.toggle-column.{{ $state ? 'true' : 'false' }}"
>
    <div
        x-data="{
            error: undefined,
            state: @js((bool) $state),
            isLoading: false,
        }"
        {{
            $attributes->merge($getExtraAttributes())->class([
                'filament-tables-toggle-column',
            ])
        }}
        wire:ignore
    >
        <button
            role="switch"
            aria-checked="false"
            x-bind:aria-checked="state.toString()"
            x-on:click="
                if (isLoading) {
                    return
                }

                state = ! state

                isLoading = true
                response = await $wire.updateTableColumnState(@js($getName()), @js($recordKey), state)
                error = response?.error ?? undefined

                if (error) {
                    state = ! state
                }

                isLoading = false
            "
            x-tooltip="error"
            x-bind:class="{
                'opacity-70 pointer-events-none': isLoading,
                '{{
                    match ($getOnColor()) {
                        'danger' => 'bg-danger-500',
                        'secondary' => 'bg-gray-500',
                        'success' => 'bg-success-500',
                        'warning' => 'bg-warning-500',
                        default => 'bg-primary-600',
                    }
                }}': state,
                '{{
                    match ($getOffColor()) {
                        'danger' => 'bg-danger-500',
                        'primary' => 'bg-primary-500',
                        'success' => 'bg-success-500',
                        'warning' => 'bg-warning-500',
                        default => 'bg-gray-200',
                    }
                }} @if (config('forms.dark_mode')) dark:bg-white/10 @endif': ! state,
            }"
            {!! $isDisabled() ? 'disabled' : null !!}
            type="button"
            class="focus:ring-primary-500 relative ml-4 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent outline-none transition-colors duration-200 ease-in-out focus:ring-1 focus:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70"
        >
            <span
                class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                x-bind:class="{
                    'translate-x-5 rtl:-translate-x-5': state,
                    'translate-x-0': ! state,
                }"
            >
                <span
                    class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                    aria-hidden="true"
                    x-bind:class="{
                        'opacity-0 ease-out duration-100': state,
                        'opacity-100 ease-in duration-200': ! state,
                    }"
                >
                    @if ($hasOffIcon())
                        <x-dynamic-component
                            :component="$getOffIcon()"
                            :class="
                                \\Illuminate\\Support\\Arr::toCssClasses([
                                    'h-3 w-3',
                                    match ($getOffColor()) {
                                        'danger' => 'text-danger-500',
                                        'primary' => 'text-primary-500',
                                        'success' => 'text-success-500',
                                        'warning' => 'text-warning-500',
                                        default => 'text-gray-400',
                                    },
                                ])
                            "
                        />
                    @endif
                </span>

                <span
                    class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                    aria-hidden="true"
                    x-bind:class="{
                        'opacity-100 ease-in duration-200': state,
                        'opacity-0 ease-out duration-100': ! state,
                    }"
                >
                    @if ($hasOnIcon())
                        <x-dynamic-component
                            :component="$getOnIcon()"
                            x-cloak
                            :class="
                                \\Illuminate\\Support\\Arr::toCssClasses([
                                    'h-3 w-3',
                                    match ($getOnColor()) {
                                        'danger' => 'text-danger-500',
                                        'secondary' => 'text-gray-400',
                                        'success' => 'text-success-500',
                                        'warning' => 'text-warning-500',
                                        default => 'text-primary-500',
                                    },
                                ])
                            "
                        />
                    @endif
                </span>
            </span>
        </button>
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});