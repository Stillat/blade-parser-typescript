import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_modal_actions_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_modal_actions_blade_php', async () => {
        const input = `@props([
    'alignment' => 'left',
    'darkMode' => false,
    'fullWidth' => false,
])

<div {{ $attributes->class([
    'filament-modal-actions',
    'flex flex-wrap items-center gap-4 rtl:space-x-reverse' => ! $fullWidth,
    'flex-row-reverse space-x-reverse' => (! $fullWidth) && ($alignment === 'right'),
    'justify-center' => (! $fullWidth) && ($alignment === 'center'),
    'grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]' => $fullWidth,
]) }}>
    {{ $slot }}
</div>
`;
        const output = `@props([
    'alignment' => 'left',
    'darkMode' => false,
    'fullWidth' => false,
])

<div
    {{
        $attributes->class([
            'filament-modal-actions',
            'flex flex-wrap items-center gap-4 rtl:space-x-reverse' => ! $fullWidth,
            'flex-row-reverse space-x-reverse' => (! $fullWidth) && ($alignment === 'right'),
            'justify-center' => (! $fullWidth) && ($alignment === 'center'),
            'grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2' => $fullWidth,
        ])
    }}
>
    {{ $slot }}
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});