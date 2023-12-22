import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: tables_resources_views_components_header_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format tables_resources_views_components_header_index_blade_php', async () => {
        const input = `@php
    use Filament\\Tables\\Actions\\Position as ActionsPosition;
@endphp

@props([
    'actions' => [],
    'actionsPosition' => ActionsPosition::End,
    'description' => null,
    'heading' => null,
])

<div {{ $attributes->class(['filament-tables-header px-4 py-2']) }}>
    <div class="flex flex-col gap-4 md:flex-row md:items-start">
        @if ($heading || $description || $actionsPosition === ActionsPosition::Start)
            <div>
                @if ($heading)
                    <x-filament-tables::header.heading>
                        {{ $heading }}
                    </x-filament-tables::header.heading>
                @endif

                @if ($description)
                    <x-filament-tables::header.description>
                        {{ $description }}
                    </x-filament-tables::header.description>
                @endif

                @if ($actionsPosition === ActionsPosition::Start)
                    <x-filament-tables::actions
                        :actions="$actions"
                        alignment="start"
                        wrap
                        @class([
                            'md:-ms-2' => ! ($heading || $description),
                            'mt-2' => $heading || $description,
                        ])
                    />
                @endif
            </div>
        @endif

        @if ($actionsPosition === ActionsPosition::End)
            <x-filament-tables::actions
                :actions="$actions"
                alignment="end"
                wrap
                class="ms-auto shrink-0 md:-me-2"
            />
        @endif
    </div>
</div>
`;
        const output = `@php
    use Filament\\Tables\\Actions\\Position as ActionsPosition;
@endphp

@props([
    'actions' => [],
    'actionsPosition' => ActionsPosition::End,
    'description' => null,
    'heading' => null,
])

<div {{ $attributes->class(['filament-tables-header px-4 py-2']) }}>
    <div class="flex flex-col gap-4 md:flex-row md:items-start">
        @if ($heading || $description || $actionsPosition === ActionsPosition::Start)
            <div>
                @if ($heading)
                    <x-filament-tables::header.heading>
                        {{ $heading }}
                    </x-filament-tables::header.heading>
                @endif

                @if ($description)
                    <x-filament-tables::header.description>
                        {{ $description }}
                    </x-filament-tables::header.description>
                @endif

                @if ($actionsPosition === ActionsPosition::Start)
                    <x-filament-tables::actions
                        :actions="$actions"
                        alignment="start"
                        wrap
                        @class([
                            'md:-ms-2' => ! ($heading || $description),
                            'mt-2' => $heading || $description,
                        ])
                    />
                @endif
            </div>
        @endif

        @if ($actionsPosition === ActionsPosition::End)
            <x-filament-tables::actions
                :actions="$actions"
                alignment="end"
                wrap
                class="ms-auto shrink-0 md:-me-2"
            />
        @endif
    </div>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});