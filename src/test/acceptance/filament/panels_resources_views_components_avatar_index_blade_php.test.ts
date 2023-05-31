import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: panels_resources_views_components_avatar_index_blade_php', () => {
    test('pint: it can format panels_resources_views_components_avatar_index_blade_php', () => {
        const input = `@props([
    'size' => 'md',
    'src',
])

<div
    {{ $attributes->class([
        'rounded-full bg-gray-200 bg-cover bg-center dark:bg-gray-900',
        match ($size) {
            'xs' => 'w-6 h-6',
            'sm' => 'w-8 h-8',
            'md' => 'w-10 h-10',
            'lg' => 'w-12 h-12',
            default => $size,
        },
    ]) }}
    style="background-image: url('{{ $src }}')"
></div>
`;
        const output = `@props([
    'size' => 'md',
    'src',
])

<div
    {{
        $attributes->class([
            'rounded-full bg-gray-200 bg-cover bg-center dark:bg-gray-900',
            match ($size) {
                'xs' => 'w-6 h-6',
                'sm' => 'w-8 h-8',
                'md' => 'w-10 h-10',
                'lg' => 'w-12 h-12',
                default => $size,
            },
        ])
    }}
    style="background-image: url('{{ $src }}')"
></div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});