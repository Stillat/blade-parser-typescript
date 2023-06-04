import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: actions_resources_views_components_actions_blade_php', () => {
    test('pint: it can format actions_resources_views_components_actions_blade_php', () => {
        const input = `@props([
    'actions',
    'alignment' => 'left',
    'fullWidth' => false,
])

@if ($actions instanceof \\Illuminate\\Contracts\\View\\View)
    {{ $actions }}
@elseif (is_array($actions))
    @php
        $actions = array_filter(
            $actions,
            fn ($action): bool => $action->isVisible(),
        );
    @endphp

    @if (count($actions))
        <div
            {{ $attributes->class([
                'filament-actions-actions',
                'flex flex-wrap items-center gap-4' => ! $fullWidth,
                match ($alignment) {
                    'center' => 'justify-center',
                    'right' => 'flex-row-reverse space-x-reverse',
                    default => 'justify-start',
                } => ! $fullWidth,
                'grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]' => $fullWidth,
            ]) }}
        >
            @foreach ($actions as $action)
                {{ $action }}
            @endforeach
        </div>
    @endif
@endif
`;
        const output = `@props([
    'actions',
    'alignment' => 'left',
    'fullWidth' => false,
])

@if ($actions instanceof \\Illuminate\\Contracts\\View\\View)
    {{ $actions }}
@elseif (is_array($actions))
    @php
        $actions = array_filter(
            $actions,
            fn ($action): bool => $action->isVisible(),
        );
    @endphp

    @if (count($actions))
        <div
            {{
                $attributes->class([
                    'filament-actions-actions',
                    'flex flex-wrap items-center gap-4' => ! $fullWidth,
                    match ($alignment) {
                        'center' => 'justify-center',
                        'right' => 'flex-row-reverse space-x-reverse',
                        default => 'justify-start',
                    } => ! $fullWidth,
                    'grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]' => $fullWidth,
                ])
            }}
        >
            @foreach ($actions as $action)
                {{ $action }}
            @endforeach
        </div>
    @endif
@endif
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});