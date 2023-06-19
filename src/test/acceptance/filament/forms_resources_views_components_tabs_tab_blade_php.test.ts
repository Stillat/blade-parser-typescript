import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_tabs_tab_blade_php', () => {
    test('pint: it can format forms_resources_views_components_tabs_tab_blade_php', () => {
        const input = `@php
    $id = $getId();
@endphp

<div
    x-bind:class="{ 'invisible h-0 p-0 overflow-y-hidden': tab !== '{{ $id }}', 'p-6': tab === '{{ $id }}' }"
    x-on:expand-concealing-component.window="
        error = $el.querySelector('[data-validation-error]')

        if (! error) {
            return
        }

        tab = @js($id)

        if (document.body.querySelector('[data-validation-error]') !== error) {
            return
        }

        setTimeout(() => $el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' }), 200)
    "
    {{
        $attributes
            ->merge([
                'aria-labelledby' => $id,
                'id' => $id,
                'role' => 'tabpanel',
                'tabindex' => '0',
                'wire:key' => "{$this->id}.{$getStatePath()}." . \\Filament\\Forms\\Components\\Tab::class . ".tabs.{$id}",
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-forms-tabs-component-tab outline-none'])
    }}
>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `@php
    $id = $getId();
@endphp

<div
    x-bind:class="{
        'invisible h-0 p-0 overflow-y-hidden': tab !== '{{ $id }}',
        'p-6': tab === '{{ $id }}',
    }"
    x-on:expand-concealing-component.window="
        error = $el.querySelector('[data-validation-error]')

        if (! error) {
            return
        }

        tab = @js($id)

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
    {{
        $attributes
            ->merge([
                'aria-labelledby' => $id,
                'id' => $id,
                'role' => 'tabpanel',
                'tabindex' => '0',
                'wire:key' => "{$this->id}.{$getStatePath()}." . \\Filament\\Forms\\Components\\Tab::class . ".tabs.{$id}",
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-forms-tabs-component-tab outline-none'])
    }}
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});