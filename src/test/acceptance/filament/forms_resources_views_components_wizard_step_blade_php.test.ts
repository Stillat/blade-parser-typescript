import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_wizard_step_blade_php', () => {
    test('pint: it can format forms_resources_views_components_wizard_step_blade_php', () => {
        const input = `@php
    $id = $getId();
@endphp

<div
    x-ref="step-{{ $id }}"
    x-bind:class="{ 'invisible h-0 overflow-y-hidden': step !== @js($id) }"
    x-on:expand-concealing-component.window="
        error = $el.querySelector('[data-validation-error]')

        if (! error) {
            return
        }

        if (! isStepAccessible(step, @js($id))) {
            return
        }

        step = @js($id)

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
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-forms-wizard-component-step outline-none'])
    }}
>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `@php
    $id = $getId();
@endphp

<div
    x-ref="step-{{ $id }}"
    x-bind:class="{ 'invisible h-0 overflow-y-hidden': step !== @js($id) }"
    x-on:expand-concealing-component.window="
        error = $el.querySelector('[data-validation-error]');

        if (! error) {
            return;
        }

        if (! isStepAccessible(step, @js($id))) {
            return;
        }

        step = @js($id);

        if (document.body.querySelector('[data-validation-error]') !== error) {
            return;
        }

        setTimeout(
            () =>
                $el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start',
                }),
            200
        )
    "
    {{
        $attributes
            ->merge([
                'aria-labelledby' => $id,
                'id' => $id,
                'role' => 'tabpanel',
                'tabindex' => '0',
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-forms-wizard-component-step outline-none'])
    }}
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});