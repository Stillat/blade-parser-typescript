import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_section_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_section_blade_php', async () => {
        const input = `@props([
    'aside' => false,
    'collapsed' => false,
    'collapsible' => false,
    'compact' => false,
    'contentBefore' => false,
    'description' => null,
    'heading',
    'icon' => null,
    'iconColor' => null,
    'iconSize' => 'md',
])

<section
    @if ($collapsible)
        x-data="{
            isCollapsed: @js($collapsed),
        }"
        x-on:open-section.window="if ($event.detail.id == $el.id) isCollapsed = false"
        x-on:collapse-section.window="if ($event.detail.id == $el.id) isCollapsed = true"
        x-on:toggle-section.window="if ($event.detail.id == $el.id) isCollapsed = ! isCollapsed"
        x-on:expand-concealing-component.window="
            error = $el.querySelector('[data-validation-error]')

            if (! error) {
                return
            }

            isCollapsed = false

            if (document.body.querySelector('[data-validation-error]') !== error) {
                return
            }

            setTimeout(() => $el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' }), 200)
        "
    @endif
    {{ $attributes->class([
        'filament-section-component',
        match ($aside) {
            true => 'grid grid-cols-1 gap-x-6 gap-y-4 items-start md:grid-cols-3',
            false => 'rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20',
        },
    ]) }}
>
    <div
        @if ($collapsible)
            x-on:click="isCollapsed = !isCollapsed"
        @endif
        @class([
            'filament-section-component-header-wrapper flex items-center overflow-hidden',
            'cursor-pointer' => $collapsible,
            match ($compact) {
                true => 'px-4 py-3',
                false => 'px-6 py-5',
            } => ! $aside,
        ])
    >
        <div class="filament-section-component-header grid flex-1 gap-y-1">
            <div class="filament-section-component-header-heading-wrapper flex items-center gap-x-2">
                @if ($icon)
                    <x-filament::icon
                        :name="$icon"
                        alias="support::section.icon"
                        :color="match ($iconColor) {
                            'danger' => 'text-danger-400',
                            'gray', null => 'text-gray-400',
                            'info' => 'text-info-400',
                            'primary' => 'text-primary-400',
                            'secondary' => 'text-secondary-400',
                            'success' => 'text-success-400',
                            'warning' => 'text-warning-400',
                            default => $iconColor,
                        }"
                        :size="match ($iconSize) {
                            'sm' => 'h-4 w-4',
                            'md' => 'h-5 w-5',
                            'lg' => 'h-6 w-6',
                            default => $iconSize,
                        }"
                        class="filament-section-component-header-icon"
                    />
                @endif

                <h3 class="filament-section-component-header-heading text-base font-semibold leading-6">
                    {{ $heading }}
                </h3>
            </div>

            @if ($description?->isNotEmpty())
                <p class="filament-section-component-header-description text-sm text-gray-500 dark:text-gray-400">
                    {{ $description }}
                </p>
            @endif
        </div>

        @if ($collapsible)
            <x-filament::icon-button
                color="gray"
                icon="heroicon-m-chevron-down"
                icon-alias="support::section.buttons.collapse"
                x-on:click.stop="isCollapsed = !isCollapsed"
                x-bind:class="{ 'rotate-180': !isCollapsed }"
                class="-my-2.5 -me-2.5"
            />
        @endif
    </div>

    <div
        @if ($collapsible)
            x-bind:aria-expanded="(!isCollapsed).toString()"
            @if ($collapsed)
                x-cloak
            @endif
            x-bind:class="{ 'invisible h-0 border-none': isCollapsed }"
        @endif
        @class([
            'filament-section-component-content-wrapper',
            'md:col-span-2' => $aside,
            'border-t border-gray-100 dark:border-white/10' => ! $aside,
            'md:order-first' => $contentBefore,
        ])
    >
        <div @class([
            'filament-section-component-content',
            'rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20' => $aside,
            match ($compact) {
                true => 'p-4',
                false => 'p-6',
            },
        ])>
            {{ $slot }}
        </div>
    </div>
</section>
`;
        const output = `@props([
    'aside' => false,
    'collapsed' => false,
    'collapsible' => false,
    'compact' => false,
    'contentBefore' => false,
    'description' => null,
    'heading',
    'icon' => null,
    'iconColor' => null,
    'iconSize' => 'md',
])

<section
    @if ($collapsible)
        x-data="{
            isCollapsed: @js($collapsed),
        }"
        x-on:open-section.window="if ($event.detail.id == $el.id) isCollapsed = false"
        x-on:collapse-section.window="if ($event.detail.id == $el.id) isCollapsed = true"
        x-on:toggle-section.window="if ($event.detail.id == $el.id) isCollapsed = ! isCollapsed"
        x-on:expand-concealing-component.window="
            error = $el.querySelector('[data-validation-error]')

            if (! error) {
                return
            }

            isCollapsed = false

            if (document.body.querySelector('[data-validation-error]') !== error) {
                return
            }

            setTimeout(
                () =>
                    $el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'start',
                    }),
                200,
            )
        "
    @endif
    {{
        $attributes->class([
            'filament-section-component',
            match ($aside) {
                true => 'grid grid-cols-1 items-start gap-x-6 gap-y-4 md:grid-cols-3',
                false => 'rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20',
            },
        ])
    }}
>
    <div
        @if ($collapsible)
            x-on:click="isCollapsed = !isCollapsed"
        @endif
        @class([
            'filament-section-component-header-wrapper flex items-center overflow-hidden',
            'cursor-pointer' => $collapsible,
            match ($compact) {
                true => 'px-4 py-3',
                false => 'px-6 py-5',
            } => ! $aside,
        ])
    >
        <div class="filament-section-component-header grid flex-1 gap-y-1">
            <div
                class="filament-section-component-header-heading-wrapper flex items-center gap-x-2"
            >
                @if ($icon)
                    <x-filament::icon
                        :name="$icon"
                        alias="support::section.icon"
                        :color="
                            match ($iconColor) {
                                'danger' => 'text-danger-400',
                                'gray', null => 'text-gray-400',
                                'info' => 'text-info-400',
                                'primary' => 'text-primary-400',
                                'secondary' => 'text-secondary-400',
                                'success' => 'text-success-400',
                                'warning' => 'text-warning-400',
                                default => $iconColor,
                            }
                        "
                        :size="
                            match ($iconSize) {
                                'sm' => 'h-4 w-4',
                                'md' => 'h-5 w-5',
                                'lg' => 'h-6 w-6',
                                default => $iconSize,
                            }
                        "
                        class="filament-section-component-header-icon"
                    />
                @endif

                <h3
                    class="filament-section-component-header-heading text-base font-semibold leading-6"
                >
                    {{ $heading }}
                </h3>
            </div>

            @if ($description?->isNotEmpty())
                <p
                    class="filament-section-component-header-description text-sm text-gray-500 dark:text-gray-400"
                >
                    {{ $description }}
                </p>
            @endif
        </div>

        @if ($collapsible)
            <x-filament::icon-button
                color="gray"
                icon="heroicon-m-chevron-down"
                icon-alias="support::section.buttons.collapse"
                x-on:click.stop="isCollapsed = !isCollapsed"
                x-bind:class="{ 'rotate-180': !isCollapsed }"
                class="-my-2.5 -me-2.5"
            />
        @endif
    </div>

    <div
        @if ($collapsible)
            x-bind:aria-expanded="(! isCollapsed).toString()"
            @if ($collapsed)
                x-cloak
            @endif
            x-bind:class="{ 'invisible h-0 border-none': isCollapsed }"
        @endif
        @class([
            'filament-section-component-content-wrapper',
            'md:col-span-2' => $aside,
            'border-t border-gray-100 dark:border-white/10' => ! $aside,
            'md:order-first' => $contentBefore,
        ])
    >
        <div
            @class([
                'filament-section-component-content',
                'rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/20' => $aside,
                match ($compact) {
                    true => 'p-4',
                    false => 'p-6',
                },
            ])
        >
            {{ $slot }}
        </div>
    </div>
</section>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});