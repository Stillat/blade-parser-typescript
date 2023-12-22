import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: forms_resources_views_components_tabs_tab_blade_php', () => {
    setupTestHooks();
    test('pint: it can format forms_resources_views_components_tabs_tab_blade_php', async () => {
        const input = `<div
    aria-labelledby="{{ $getId() }}"
    id="{{ $getId() }}"
    role="tabpanel"
    tabindex="0"
    x-bind:class="{ 'invisible h-0 p-0 overflow-y-hidden': tab !== '{{ $getId() }}', 'p-6': tab === '{{ $getId() }}' }"
    x-on:expand-concealing-component.window="
        error = $el.querySelector('[data-validation-error]')

        if (! error) {
            return
        }

        tab = @js($getId())

        if (document.body.querySelector('[data-validation-error]') !== error) {
            return
        }

        setTimeout(() => $el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' }), 200)
    "
    {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-tabs-component-tab outline-none']) }}
    wire:key="{{ $this->id }}.{{ $getStatePath() }}.{{ \\Filament\\Forms\\Components\\Tab::class }}.tabs.{{ $getId() }}"
>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `<div
    aria-labelledby="{{ $getId() }}"
    id="{{ $getId() }}"
    role="tabpanel"
    tabindex="0"
    x-bind:class="{
        'invisible h-0 p-0 overflow-y-hidden': tab !== '{{ $getId() }}',
        'p-6': tab === '{{ $getId() }}',
    }"
    x-on:expand-concealing-component.window="
        error = $el.querySelector('[data-validation-error]')

        if (! error) {
            return
        }

        tab = @js($getId())

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
    {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-tabs-component-tab outline-none']) }}
    wire:key="{{ $this->id }}.{{ $getStatePath() }}.{{ \\Filament\\Forms\\Components\\Tab::class }}.tabs.{{ $getId() }}"
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});