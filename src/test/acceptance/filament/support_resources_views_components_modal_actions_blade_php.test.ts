import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: support_resources_views_components_modal_actions_blade_php', () => {
    test('pint: it can format support_resources_views_components_modal_actions_blade_php', () => {
        const input = `@props([
    'alignment' => \\Filament\\Actions\\MountableAction::getModalActionsAlignment(),
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
    'alignment' => \\Filament\\Actions\\MountableAction::getModalActionsAlignment(),
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});