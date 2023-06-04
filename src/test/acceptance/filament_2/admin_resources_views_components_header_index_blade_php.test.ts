import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: admin_resources_views_components_header_index_blade_php', () => {
    test('pint: it can format admin_resources_views_components_header_index_blade_php', () => {
        const input = `@props([
    'actions' => null,
    'heading',
    'subheading' => null
])

<header {{ $attributes->class(['filament-header space-y-2 items-start justify-between sm:flex sm:space-y-0 sm:space-x-4  sm:rtl:space-x-reverse sm:py-4']) }}>
    <div>
        <x-filament::header.heading>
            {{ $heading }}
        </x-filament::header.heading>

        @if ($subheading)
            <x-filament::header.subheading class="mt-1">
                {{ $subheading }}
            </x-filament::header.subheading>
        @endif
    </div>


    <x-filament::pages.actions :actions="$actions" class="shrink-0" />
</header>
`;
        const output = `@props([
    'actions' => null,
    'heading',
    'subheading' => null,
])

<header
    {{ $attributes->class(['filament-header items-start justify-between space-y-2 sm:flex sm:space-x-4 sm:space-y-0 sm:py-4 sm:rtl:space-x-reverse']) }}
>
    <div>
        <x-filament::header.heading>
            {{ $heading }}
        </x-filament::header.heading>

        @if ($subheading)
            <x-filament::header.subheading class="mt-1">
                {{ $subheading }}
            </x-filament::header.subheading>
        @endif
    </div>

    <x-filament::pages.actions :actions="$actions" class="shrink-0" />
</header>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});