import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_card_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_card_index_blade_php', async () => {
        const input = `@props([
    'actions' => null,
    'footer' => null,
    'header' => null,
    'heading' => null,
])

<div {{ $attributes->class(['filament-card space-y-2 rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20']) }}>
    @if ($actions || $header || $heading)
        <div class="px-4 py-2">
            @if ($header)
                {{ $header }}
            @elseif ($actions || $heading)
                <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <x-filament::card.heading>
                        {{ $heading }}
                    </x-filament::card.heading>

                    @if ($actions)
                        <div class="flex items-center space-x-2 rtl:space-x-reverse">
                            {{ $actions }}
                        </div>
                    @endif
                </div>
            @endif
        </div>
    @endif

    @if (($actions || $header || $heading) && $slot->isNotEmpty())
        <x-filament::hr />
    @endif

    <div class="space-y-2">
        @if ($slot->isNotEmpty())
            <div class="px-4 py-2 space-y-4">
                {{ $slot }}
            </div>
        @endif
    </div>

    @if ($footer && $slot->isNotEmpty())
        <x-filament::hr />
    @endif

    @if ($footer)
        <div class="px-4 py-2">
            {{ $footer }}
        </div>
    @endif
</div>
`;
        const output = `@props([
    'actions' => null,
    'footer' => null,
    'header' => null,
    'heading' => null,
])

<div
    {{ $attributes->class(['filament-card space-y-2 rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20']) }}
>
    @if ($actions || $header || $heading)
        <div class="px-4 py-2">
            @if ($header)
                {{ $header }}
            @elseif ($actions || $heading)
                <div
                    class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
                >
                    <x-filament::card.heading>
                        {{ $heading }}
                    </x-filament::card.heading>

                    @if ($actions)
                        <div
                            class="flex items-center space-x-2 rtl:space-x-reverse"
                        >
                            {{ $actions }}
                        </div>
                    @endif
                </div>
            @endif
        </div>
    @endif

    @if (($actions || $header || $heading) && $slot->isNotEmpty())
        <x-filament::hr />
    @endif

    <div class="space-y-2">
        @if ($slot->isNotEmpty())
            <div class="space-y-4 px-4 py-2">
                {{ $slot }}
            </div>
        @endif
    </div>

    @if ($footer && $slot->isNotEmpty())
        <x-filament::hr />
    @endif

    @if ($footer)
        <div class="px-4 py-2">
            {{ $footer }}
        </div>
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});