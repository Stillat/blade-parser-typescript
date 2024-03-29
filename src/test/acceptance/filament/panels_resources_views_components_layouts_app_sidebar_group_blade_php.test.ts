import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: panels_resources_views_components_layouts_app_sidebar_group_blade_php', () => {
    setupTestHooks();
    test('pint: it can format panels_resources_views_components_layouts_app_sidebar_group_blade_php', async () => {
        const input = `@props([
    'parentGroup' => null,
    'collapsible' => true,
    'icon' => null,
    'items' => [],
    'label' => null,
])

<li
    x-data="{ label: {{ \\Illuminate\\Support\\Js::from((filled($parentGroup) ? "{$parentGroup}." : null) . $label) }} }"
    class="filament-sidebar-group"
    @if (filled($parentGroup))
        x-bind:class="{{ config('filament.layout.sidebar.is_collapsible_on_desktop') ? '$store.sidebar.isOpen' : 'true' }} ? 'ms-11 pe-3 pt-3' : 'hidden'"
    @endif
>
    @if ($label)
        <button
            @if ($collapsible)
                x-on:click.prevent="$store.sidebar.toggleCollapsedGroup(label)"
            @endif
            @if (filament()->isSidebarCollapsibleOnDesktop())
                x-show="$store.sidebar.isOpen"
                x-transition:enter="lg:transition delay-100"
                x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100"
            @endif
            class="flex items-center justify-between w-full"
        >
            <div class="flex items-center gap-4">
                @if ($icon)
                    <x-filament::icon
                        :name="$icon"
                        alias="app::sidebar.group"
                        color="text-gray-600 dark:text-gray-300"
                        size="h-3 w-3"
                        class="ms-1 shrink-0"
                    />
                @endif

                <p class="flex-1 font-bold uppercase text-xs tracking-wider text-primary-600 dark:text-primary-500">
                    {{ $label }}
                </p>
            </div>

            @if ($collapsible)
                <x-filament::icon
                    name="heroicon-m-chevron-up"
                    alias="app::sidebar.group.collapse"
                    size="h-5 w-5"
                    class="text-gray-600 transition dark:text-gray-300"
                    x-bind:class="!$store.sidebar.groupIsCollapsed(label) || 'rotate-180'"
                />
            @endif
        </button>
    @endif

    <ul
        x-show="! ($store.sidebar.groupIsCollapsed(label) && {{ filament()->isSidebarCollapsibleOnDesktop() ? '$store.sidebar.isOpen' : 'true' }})"
        @if (filament()->isSidebarCollapsibleOnDesktop())
            x-transition:enter="lg:transition delay-100"
            x-transition:enter-start="opacity-0"
            x-transition:enter-end="opacity-100"
        @endif
        x-collapse.duration.200ms
        @class([
            'text-sm space-y-1 -mx-3',
            'mt-2' => $label,
        ])
    >
        @foreach ($items as $item)
            @if ($item instanceof \\Filament\\Navigation\\NavigationItem)
                <x-filament::layouts.app.sidebar.item
                    :active="$item->isActive()"
                    :icon="$item->getIcon()"
                    :active-icon="$item->getActiveIcon()"
                    :url="$item->getUrl()"
                    :badge="$item->getBadge()"
                    :badgeColor="$item->getBadgeColor()"
                    :shouldOpenUrlInNewTab="$item->shouldOpenUrlInNewTab()"
                >
                    {{ $item->getLabel() }}
                </x-filament::layouts.app.sidebar.item>
            @elseif ($item instanceof \\Filament\\Navigation\\NavigationGroup)
                <x-filament::layouts.app.sidebar.group
                    :label="$item->getLabel()"
                    :icon="$item->getIcon()"
                    :collapsible="$item->isCollapsible()"
                    :items="$item->getItems()"
                    :parentGroup="(filled($parentGroup) ? ('$parentGroup' . '.') : null) . $label"
                />
            @endif
        @endforeach
    </ul>
</li>
`;
        const output = `@props([
    'parentGroup' => null,
    'collapsible' => true,
    'icon' => null,
    'items' => [],
    'label' => null,
])

<li
    x-data="{
        label: {{ \\Illuminate\\Support\\Js::from((filled($parentGroup) ? "{$parentGroup}." : null).$label) }},
    }"
    class="filament-sidebar-group"
    @if (filled($parentGroup))
        x-bind:class="
            {{ config('filament.layout.sidebar.is_collapsible_on_desktop') ? '$store.sidebar.isOpen' : 'true' }}
                ? 'ms-11 pe-3 pt-3'
                : 'hidden'
        "
    @endif
>
    @if ($label)
        <button
            @if ($collapsible)
                x-on:click.prevent="$store.sidebar.toggleCollapsedGroup(label)"
            @endif
            @if (filament()->isSidebarCollapsibleOnDesktop())
                x-show="$store.sidebar.isOpen"
                x-transition:enter="delay-100 lg:transition"
                x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100"
            @endif
            class="flex w-full items-center justify-between"
        >
            <div class="flex items-center gap-4">
                @if ($icon)
                    <x-filament::icon
                        :name="$icon"
                        alias="app::sidebar.group"
                        color="text-gray-600 dark:text-gray-300"
                        size="h-3 w-3"
                        class="ms-1 shrink-0"
                    />
                @endif

                <p
                    class="text-primary-600 dark:text-primary-500 flex-1 text-xs font-bold uppercase tracking-wider"
                >
                    {{ $label }}
                </p>
            </div>

            @if ($collapsible)
                <x-filament::icon
                    name="heroicon-m-chevron-up"
                    alias="app::sidebar.group.collapse"
                    size="h-5 w-5"
                    class="text-gray-600 transition dark:text-gray-300"
                    x-bind:class="!$store.sidebar.groupIsCollapsed(label) || 'rotate-180'"
                />
            @endif
        </button>
    @endif

    <ul
        x-show="
            ! (
                $store.sidebar.groupIsCollapsed(label) &&
                {{ filament()->isSidebarCollapsibleOnDesktop() ? '$store.sidebar.isOpen' : 'true' }}
            )
        "
        @if (filament()->isSidebarCollapsibleOnDesktop())
            x-transition:enter="delay-100 lg:transition"
            x-transition:enter-start="opacity-0"
            x-transition:enter-end="opacity-100"
        @endif
        x-collapse.duration.200ms
        @class([
            '-mx-3 space-y-1 text-sm',
            'mt-2' => $label,
        ])
    >
        @foreach ($items as $item)
            @if ($item instanceof \\Filament\\Navigation\\NavigationItem)
                <x-filament::layouts.app.sidebar.item
                    :active="$item->isActive()"
                    :icon="$item->getIcon()"
                    :active-icon="$item->getActiveIcon()"
                    :url="$item->getUrl()"
                    :badge="$item->getBadge()"
                    :badgeColor="$item->getBadgeColor()"
                    :shouldOpenUrlInNewTab="$item->shouldOpenUrlInNewTab()"
                >
                    {{ $item->getLabel() }}
                </x-filament::layouts.app.sidebar.item>
            @elseif ($item instanceof \\Filament\\Navigation\\NavigationGroup)
                <x-filament::layouts.app.sidebar.group
                    :label="$item->getLabel()"
                    :icon="$item->getIcon()"
                    :collapsible="$item->isCollapsible()"
                    :items="$item->getItems()"
                    :parentGroup="(filled($parentGroup) ? ('$parentGroup'.'.') : null).$label"
                />
            @endif
        @endforeach
    </ul>
</li>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});