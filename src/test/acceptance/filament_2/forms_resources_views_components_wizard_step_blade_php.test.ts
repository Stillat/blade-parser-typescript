import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: forms_resources_views_components_wizard_step_blade_php', () => {
    test('pint: it can format forms_resources_views_components_wizard_step_blade_php', () => {
        const input = `<div
    aria-labelledby="{{ $getId() }}"
    id="{{ $getId() }}"
    x-ref="step-{{ $getId() }}"
    role="tabpanel"
    tabindex="0"
    x-bind:class="{ 'invisible h-0 overflow-y-hidden': step !== @js($getId()) }"
    x-on:expand-concealing-component.window="
        error = $el.querySelector('[data-validation-error]')

        if (! error) {
            return
        }

        if (! isStepAccessible(step, @js($getId()))) {
            return
        }

        step = @js($getId())

        if (document.body.querySelector('[data-validation-error]') !== error) {
            return
        }

        setTimeout(() => $el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' }), 200)
    "
    {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-wizard-component-step outline-none']) }}
>
    {{ $getChildComponentContainer() }}
</div>
`;
        const output = `<div
    aria-labelledby="{{ $getId() }}"
    id="{{ $getId() }}"
    x-ref="step-{{ $getId() }}"
    role="tabpanel"
    tabindex="0"
    x-bind:class="{ 'invisible h-0 overflow-y-hidden': step !== @js($getId()) }"
    x-on:expand-concealing-component.window="
        error = $el.querySelector('[data-validation-error]')

        if (! error) {
            return
        }

        if (! isStepAccessible(step, @js($getId()))) {
            return
        }

        step = @js($getId())

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
    {{ $attributes->merge($getExtraAttributes())->class(['filament-forms-wizard-component-step outline-none']) }}
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});