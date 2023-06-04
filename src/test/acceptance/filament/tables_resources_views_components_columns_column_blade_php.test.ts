import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: tables_resources_views_components_columns_column_blade_php', () => {
    test('pint: it can format tables_resources_views_components_columns_column_blade_php', () => {
        const input = `@props([
    'column',
    'isClickDisabled' => false,
    'record',
    'recordAction' => null,
    'recordKey' => null,
    'recordUrl' => null,
])

@php
    $action = $column->getAction();
    $name = $column->getName();
    $shouldOpenUrlInNewTab = $column->shouldOpenUrlInNewTab();
    $tooltip = $column->getTooltip();
    $url = $column->getUrl();

    $columnClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'flex w-full disabled:opacity-70 disabled:pointer-events-none',
        match ($column->getAlignment()) {
            'center' => 'justify-center text-center',
            'end' => 'justify-end text-end',
            'left' => 'justify-start text-left',
            'right' => 'justify-end text-right',
            'justify' => 'justify-between text-justify',
            default => 'justify-start text-start',
        },
    ]);

    $slot = $column->viewData(['recordKey' => $recordKey]);
@endphp

<div
    @if ($tooltip)
        x-data="{}"
        x-tooltip.raw="{{ $tooltip }}"
    @endif
    {{ $attributes->class(['filament-tables-column-wrapper']) }}
>
    @if (($url || ($recordUrl && $action === null)) && (! $isClickDisabled))
        <a
            href="{{ $url ?: $recordUrl }}"
            @if ($shouldOpenUrlInNewTab) target="_blank" @endif
            class="{{ $columnClasses }}"
        >
            {{ $slot }}
        </a>
    @elseif (($action || $recordAction) && (! $isClickDisabled))
        @php
            if ($action instanceof \\Filament\\Tables\\Actions\\Action) {
                $wireClickAction = "mountTableAction('{$action->getName()}', '{$recordKey}')";
            } elseif ($action) {
                $wireClickAction = "callTableColumnAction('{$name}', '{$recordKey}')";
            } else {
                if ($this->getTable()->getAction($recordAction)) {
                    $wireClickAction = "mountTableAction('{$recordAction}', '{$recordKey}')";
                } else {
                    $wireClickAction = "{$recordAction}('{$recordKey}')";
                }
            }
        @endphp

        <button
            wire:click="{{ $wireClickAction }}"
            wire:target="{{ $wireClickAction }}"
            wire:loading.attr="disabled"
            type="button"
            class="{{ $columnClasses }}"
        >
            {{ $slot }}
        </button>
    @else
        <div class="{{ $columnClasses }}">
            {{ $slot }}
        </div>
    @endif
</div>
`;
        const output = `@props([
    'column',
    'isClickDisabled' => false,
    'record',
    'recordAction' => null,
    'recordKey' => null,
    'recordUrl' => null,
])

@php
    $action = $column->getAction();
    $name = $column->getName();
    $shouldOpenUrlInNewTab = $column->shouldOpenUrlInNewTab();
    $tooltip = $column->getTooltip();
    $url = $column->getUrl();

    $columnClasses = \\Illuminate\\Support\\Arr::toCssClasses([
        'flex w-full disabled:opacity-70 disabled:pointer-events-none',
        match ($column->getAlignment()) {
            'center' => 'justify-center text-center',
            'end' => 'justify-end text-end',
            'left' => 'justify-start text-left',
            'right' => 'justify-end text-right',
            'justify' => 'justify-between text-justify',
            default => 'justify-start text-start',
        },
    ]);

    $slot = $column->viewData(['recordKey' => $recordKey]);
@endphp

<div
    @if ($tooltip)
        x-data="{}"
        x-tooltip.raw="{{ $tooltip }}"
    @endif
    {{ $attributes->class(['filament-tables-column-wrapper']) }}
>
    @if (($url || ($recordUrl && $action === null)) && (! $isClickDisabled))
        <a
            href="{{ $url ?: $recordUrl }}"
            @if ($shouldOpenUrlInNewTab) target="_blank" @endif
            class="{{ $columnClasses }}"
        >
            {{ $slot }}
        </a>
    @elseif (($action || $recordAction) && (! $isClickDisabled))
        @php
            if ($action instanceof \\Filament\\Tables\\Actions\\Action) {
                $wireClickAction = "mountTableAction('{$action->getName()}', '{$recordKey}')";
            } elseif ($action) {
                $wireClickAction = "callTableColumnAction('{$name}', '{$recordKey}')";
            } else {
                if ($this->getTable()->getAction($recordAction)) {
                    $wireClickAction = "mountTableAction('{$recordAction}', '{$recordKey}')";
                } else {
                    $wireClickAction = "{$recordAction}('{$recordKey}')";
                }
            }
        @endphp

        <button
            wire:click="{{ $wireClickAction }}"
            wire:target="{{ $wireClickAction }}"
            wire:loading.attr="disabled"
            type="button"
            class="{{ $columnClasses }}"
        >
            {{ $slot }}
        </button>
    @else
        <div class="{{ $columnClasses }}">
            {{ $slot }}
        </div>
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});