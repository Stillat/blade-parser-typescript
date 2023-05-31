import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: notifications_resources_views_components_actions_index_blade_php', () => {
    test('pint: it can format notifications_resources_views_components_actions_index_blade_php', () => {
        const input = `@props([
    'actions',
])

<div {{ $attributes->class(['filament-notifications-actions mt-2 flex gap-3']) }}>
    @foreach ($actions as $action)
        {{ $action }}
    @endforeach
</div>
`;
        const output = `@props([
    'actions',
])

<div
    {{ $attributes->class(['filament-notifications-actions mt-2 flex gap-3']) }}
>
    @foreach ($actions as $action)
        {{ $action }}
    @endforeach
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});