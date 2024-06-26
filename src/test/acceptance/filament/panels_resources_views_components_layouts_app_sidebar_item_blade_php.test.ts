import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_components_layouts_app_sidebar_item_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_components_layouts_app_sidebar_item_blade_php', async () => {
        const input = `@props([
    'active' => false,
    'activeIcon' => null,
    'badge' => null,
    'badgeColor' => null,
    'icon',
    'shouldOpenUrlInNewTab' => false,
    'url',
])

<li @class(['filament-sidebar-item overflow-hidden', 'filament-sidebar-item-active' => $active])>
    <a
        href="{{ $url }}"
        @if ($shouldOpenUrlInNewTab) target="_blank" @endif
        x-on:click="window.matchMedia(\`(max-width: 1024px)\`).matches && $store.sidebar.close()"
        @if (filament()->isSidebarCollapsibleOnDesktop())
            x-data="{ tooltip: {} }"
            x-init="
                Alpine.effect(() => {
                    if (Alpine.store('sidebar').isOpen) {
                        tooltip = false
                    } else {
                        tooltip = {
                            content: @js($slot->toHtml()),
                            theme: Alpine.store('theme') === 'light' ? 'dark' : 'light',
                            placement: document.dir === 'rtl' ? 'left' : 'right',
                        }
                    }
                })
            "
            x-tooltip.html="tooltip"
        @endif
        @class([
            'flex items-center justify-center gap-3 px-3 py-2 rounded-lg font-medium transition',
            'hover:bg-gray-500/5 focus:bg-gray-500/5 dark:text-gray-300 dark:hover:bg-gray-700' => ! $active,
            'bg-primary-500 text-white' => $active,
        ])
    >
        <x-filament::icon
            :name="($active && $activeIcon) ? $activeIcon : $icon"
            alias="app::sidebar.item"
            :color="(! $active) ? 'text-gray-600 dark:text-gray-500' : null"
            size="h-6 w-6"
        />

        <div
            @if (filament()->isSidebarCollapsibleOnDesktop())
                x-show="$store.sidebar.isOpen"
                x-transition:enter="lg:transition delay-100"
                x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100"
            @endif
            class="flex flex-1"
        >
            {{ $slot }}
        </div>

        @if (filled($badge))
            <x-filament::layouts.app.sidebar.badge
                :badge="$badge"
                :badge-color="$badgeColor"
                :active="$active"
            />
        @endif
    </a>
</li>
`;
        const output = `@props([
    'active' => false,
    'activeIcon' => null,
    'badge' => null,
    'badgeColor' => null,
    'icon',
    'shouldOpenUrlInNewTab' => false,
    'url',
])

<li
    @class(['filament-sidebar-item overflow-hidden', 'filament-sidebar-item-active' => $active])
>
    <a
        href="{{ $url }}"
        @if ($shouldOpenUrlInNewTab) target="_blank" @endif
        x-on:click="window.matchMedia(\`(max-width: 1024px)\`).matches && $store.sidebar.close()"
        @if (filament()->isSidebarCollapsibleOnDesktop())
            x-data="{ tooltip: {} }"
            x-init="
                Alpine.effect(() => {
                    if (Alpine.store('sidebar').isOpen) {
                        tooltip = false
                    } else {
                        tooltip = {
                            content: @js($slot->toHtml()),
                            theme: Alpine.store('theme') === 'light' ? 'dark' : 'light',
                            placement: document.dir === 'rtl' ? 'left' : 'right',
                        }
                    }
                })
            "
            x-tooltip.html="tooltip"
        @endif
        @class([
            'flex items-center justify-center gap-3 rounded-lg px-3 py-2 font-medium transition',
            'hover:bg-gray-500/5 focus:bg-gray-500/5 dark:text-gray-300 dark:hover:bg-gray-700' => ! $active,
            'bg-primary-500 text-white' => $active,
        ])
    >
        <x-filament::icon
            :name="($active && $activeIcon) ? $activeIcon : $icon"
            alias="app::sidebar.item"
            :color="(! $active) ? 'text-gray-600 dark:text-gray-500' : null"
            size="h-6 w-6"
        />

        <div
            @if (filament()->isSidebarCollapsibleOnDesktop())
                x-show="$store.sidebar.isOpen"
                x-transition:enter="delay-100 lg:transition"
                x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100"
            @endif
            class="flex flex-1"
        >
            {{ $slot }}
        </div>

        @if (filled($badge))
            <x-filament::layouts.app.sidebar.badge
                :badge="$badge"
                :badge-color="$badgeColor"
                :active="$active"
            />
        @endif
    </a>
</li>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});