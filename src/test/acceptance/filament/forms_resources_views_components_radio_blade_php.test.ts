import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_radio_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_radio_blade_php', async () => {
        const input = `<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    @php
        $id = $getId();
        $isDisabled = $isDisabled();
        $isInline = $isInline();
        $statePath = $getStatePath();
    @endphp

    @if ($isInline)
        {{-- format-ignore-start --}}<x-slot name="labelSuffix">{{-- format-ignore-end --}}
    @endif
            <x-filament::grid
                :default="$getColumns('default')"
                :sm="$getColumns('sm')"
                :md="$getColumns('md')"
                :lg="$getColumns('lg')"
                :xl="$getColumns('xl')"
                :two-xl="$getColumns('2xl')"
                :is-grid="! $isInline"
                direction="column"
                :attributes="\\Filament\\Support\\prepare_inherited_attributes($attributes->merge($getExtraAttributes(), escape: false)->class([
                    'filament-forms-radio-component flex flex-wrap gap-3',
                    'flex-col' => ! $isInline,
                ]))"
            >
                @foreach ($getOptions() as $value => $label)
                    @php
                        $shouldOptionBeDisabled = $isDisabled || $isOptionDisabled($value, $label);
                    @endphp

                    <div @class([
                        'flex items-start',
                        'gap-3' => ! $isInline,
                        'gap-2' => $isInline,
                    ])>
                        <div class="flex items-center h-5">
                            <input
                                name="{{ $id }}"
                                id="{{ $id }}-{{ $value }}"
                                type="radio"
                                value="{{ $value }}"
                                dusk="filament.forms.{{ $statePath }}"
                                @disabled($shouldOptionBeDisabled)
                                {{ $applyStateBindingModifiers('wire:model') }}="{{ $statePath }}"
                                {{ $getExtraInputAttributeBag()->class([
                                    'h-4 w-4 text-primary-600 outline-none ring-1 ring-inset disabled:opacity-70 dark:bg-gray-700 dark:checked:bg-primary-500',
                                    'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-500' => ! $errors->has($statePath),
                                    'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $errors->has($statePath),
                                ]) }}
                                wire:loading.attr="disabled"
                            />
                        </div>

                        <div class="text-sm">
                            <label for="{{ $id }}-{{ $value }}" @class([
                                'font-medium',
                                'text-gray-700 dark:text-gray-200' => ! $errors->has($statePath),
                                'text-danger-600 dark:text-danger-400' => $errors->has($statePath),
                                'opacity-50' => $shouldOptionBeDisabled,
                            ])>
                                {{ $label }}
                            </label>

                            @if ($hasDescription($value))
                                <p class="text-gray-500 dark:text-gray-400">
                                    {{ $getDescription($value) }}
                                </p>
                            @endif
                        </div>
                    </div>
                @endforeach
            </x-filament::grid>
    @if ($isInline)
        {{-- format-ignore-start --}}</x-slot>{{-- format-ignore-end --}}
    @endif
</x-dynamic-component>
`;
        const output = `<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    @php
        $id = $getId();
        $isDisabled = $isDisabled();
        $isInline = $isInline();
        $statePath = $getStatePath();
    @endphp

    @if ($isInline)
        {{-- format-ignore-start --}}<x-slot name="labelSuffix">{{-- format-ignore-end --}}
    @endif

    <x-filament::grid
        :default="$getColumns('default')"
        :sm="$getColumns('sm')"
        :md="$getColumns('md')"
        :lg="$getColumns('lg')"
        :xl="$getColumns('xl')"
        :two-xl="$getColumns('2xl')"
        :is-grid="! $isInline"
        direction="column"
        :attributes="
            \\Filament\\Support\\prepare_inherited_attributes($attributes->merge($getExtraAttributes(), escape: false)->class([
                'filament-forms-radio-component flex flex-wrap gap-3',
                'flex-col' => ! $isInline,
            ]))
        "
    >
        @foreach ($getOptions() as $value => $label)
            @php
                $shouldOptionBeDisabled = $isDisabled || $isOptionDisabled($value, $label);
            @endphp

            <div
                @class([
                    'flex items-start',
                    'gap-3' => ! $isInline,
                    'gap-2' => $isInline,
                ])
            >
                <div class="flex h-5 items-center">
                    <input
                        name="{{ $id }}"
                        id="{{ $id }}-{{ $value }}"
                        type="radio"
                        value="{{ $value }}"
                        dusk="filament.forms.{{ $statePath }}"
                        @disabled($shouldOptionBeDisabled)
                        {{ $applyStateBindingModifiers('wire:model') }}="{{ $statePath }}"
                        {{
                            $getExtraInputAttributeBag()->class([
                                'text-primary-600 dark:checked:bg-primary-500 h-4 w-4 outline-none ring-1 ring-inset disabled:opacity-70 dark:bg-gray-700',
                                'focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 border-gray-300 dark:border-gray-600' => ! $errors->has($statePath),
                                'border-danger-600 ring-danger-600 dark:border-danger-400 dark:ring-danger-400' => $errors->has($statePath),
                            ])
                        }}
                        wire:loading.attr="disabled"
                    />
                </div>

                <div class="text-sm">
                    <label
                        for="{{ $id }}-{{ $value }}"
                        @class([
                            'font-medium',
                            'text-gray-700 dark:text-gray-200' => ! $errors->has($statePath),
                            'text-danger-600 dark:text-danger-400' => $errors->has($statePath),
                            'opacity-50' => $shouldOptionBeDisabled,
                        ])
                    >
                        {{ $label }}
                    </label>

                    @if ($hasDescription($value))
                        <p class="text-gray-500 dark:text-gray-400">
                            {{ $getDescription($value) }}
                        </p>
                    @endif
                </div>
            </div>
        @endforeach
    </x-filament::grid>
    @if ($isInline)
        {{-- format-ignore-start --}}</x-slot>{{-- format-ignore-end --}}
    @endif
</x-dynamic-component>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});