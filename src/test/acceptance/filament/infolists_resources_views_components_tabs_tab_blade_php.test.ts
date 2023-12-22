import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: infolists_resources_views_components_tabs_tab_blade_php', () => {
    setupTestHooks();
    test('pint: it can format infolists_resources_views_components_tabs_tab_blade_php', async () => {
        const input = `@php
    $id = $getId();
@endphp

<div
    x-bind:class="{ 'invisible h-0 p-0 overflow-y-hidden': tab !== '{{ $id }}', 'p-6': tab === '{{ $id }}' }"
    {{
        $attributes
            ->merge([
                'aria-labelledby' => $id,
                'id' => $id,
                'role' => 'tabpanel',
                'tabindex' => '0',
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-infolists-tabs-component-tab outline-none'])
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
    {{
        $attributes
            ->merge([
                'aria-labelledby' => $id,
                'id' => $id,
                'role' => 'tabpanel',
                'tabindex' => '0',
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['filament-infolists-tabs-component-tab outline-none'])
    }}
>
    {{ $getChildComponentContainer() }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});