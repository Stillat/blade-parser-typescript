import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: support_resources_views_components_grid_index_blade_php', () => {
    test('pint: it can format support_resources_views_components_grid_index_blade_php', () => {
        const input = `@props([
    'isGrid' => true,
    'default' => 1,
    'direction' => 'row',
    'sm' => null,
    'md' => null,
    'lg' => null,
    'xl' => null,
    'twoXl' => null,
])

<div
    {{
        $attributes->class([
            'grid' => $isGrid && $direction === 'row',
            $default ? match ($default) {
                1 => $direction === 'row' ? 'grid-cols-1' : 'columns-1',
                2 => $direction === 'row' ? 'grid-cols-2' : 'columns-2',
                3 => $direction === 'row' ? 'grid-cols-3' : 'columns-3',
                4 => $direction === 'row' ? 'grid-cols-4' : 'columns-4',
                5 => $direction === 'row' ? 'grid-cols-5' : 'columns-5',
                6 => $direction === 'row' ? 'grid-cols-6' : 'columns-6',
                7 => $direction === 'row' ? 'grid-cols-7' : 'columns-7',
                8 => $direction === 'row' ? 'grid-cols-8' : 'columns-8',
                9 => $direction === 'row' ? 'grid-cols-9' : 'columns-9',
                10 => $direction === 'row' ? 'grid-cols-10' : 'columns-10',
                11 => $direction === 'row' ? 'grid-cols-11' : 'columns-11',
                12 => $direction === 'row' ? 'grid-cols-12' : 'columns-12',
                default => $default,
            } : null,
            $sm ? match ($sm) {
                1 => $direction === 'row' ? 'sm:grid-cols-1' : 'sm:columns-1',
                2 => $direction === 'row' ? 'sm:grid-cols-2' : 'sm:columns-2',
                3 => $direction === 'row' ? 'sm:grid-cols-3' : 'sm:columns-3',
                4 => $direction === 'row' ? 'sm:grid-cols-4' : 'sm:columns-4',
                5 => $direction === 'row' ? 'sm:grid-cols-5' : 'sm:columns-5',
                6 => $direction === 'row' ? 'sm:grid-cols-6' : 'sm:columns-6',
                7 => $direction === 'row' ? 'sm:grid-cols-7' : 'sm:columns-7',
                8 => $direction === 'row' ? 'sm:grid-cols-8' : 'sm:columns-8',
                9 => $direction === 'row' ? 'sm:grid-cols-9' : 'sm:columns-9',
                10 => $direction === 'row' ? 'sm:grid-cols-10' : 'sm:columns-10',
                11 => $direction === 'row' ? 'sm:grid-cols-11' : 'sm:columns-11',
                12 => $direction === 'row' ? 'sm:grid-cols-12' : 'sm:columns-12',
                default => $sm,
            } : null,
            $md ? match ($md) {
                1 => $direction === 'row' ? 'md:grid-cols-1' : 'md:columns-1',
                2 => $direction === 'row' ? 'md:grid-cols-2' : 'md:columns-2',
                3 => $direction === 'row' ? 'md:grid-cols-3' : 'md:columns-3',
                4 => $direction === 'row' ? 'md:grid-cols-4' : 'md:columns-4',
                5 => $direction === 'row' ? 'md:grid-cols-5' : 'md:columns-5',
                6 => $direction === 'row' ? 'md:grid-cols-6' : 'md:columns-6',
                7 => $direction === 'row' ? 'md:grid-cols-7' : 'md:columns-7',
                8 => $direction === 'row' ? 'md:grid-cols-8' : 'md:columns-8',
                9 => $direction === 'row' ? 'md:grid-cols-9' : 'md:columns-9',
                10 => $direction === 'row' ? 'md:grid-cols-10' : 'md:columns-10',
                11 => $direction === 'row' ? 'md:grid-cols-11' : 'md:columns-11',
                12 => $direction === 'row' ? 'md:grid-cols-12' : 'md:columns-12',
                default => $md,
            } : null,
            $lg ? match ($lg) {
                1 => $direction === 'row' ? 'lg:grid-cols-1' : 'lg:columns-1',
                2 => $direction === 'row' ? 'lg:grid-cols-2' : 'lg:columns-2',
                3 => $direction === 'row' ? 'lg:grid-cols-3' : 'lg:columns-3',
                4 => $direction === 'row' ? 'lg:grid-cols-4' : 'lg:columns-4',
                5 => $direction === 'row' ? 'lg:grid-cols-5' : 'lg:columns-5',
                6 => $direction === 'row' ? 'lg:grid-cols-6' : 'lg:columns-6',
                7 => $direction === 'row' ? 'lg:grid-cols-7' : 'lg:columns-7',
                8 => $direction === 'row' ? 'lg:grid-cols-8' : 'lg:columns-8',
                9 => $direction === 'row' ? 'lg:grid-cols-9' : 'lg:columns-9',
                10 => $direction === 'row' ? 'lg:grid-cols-10' : 'lg:columns-10',
                11 => $direction === 'row' ? 'lg:grid-cols-11' : 'lg:columns-11',
                12 => $direction === 'row' ? 'lg:grid-cols-12' : 'lg:columns-12',
                default => $lg,
            } : null,
            $xl ? match ($xl) {
                1 => $direction === 'row' ? 'xl:grid-cols-1' : 'xl:columns-1',
                2 => $direction === 'row' ? 'xl:grid-cols-2' : 'xl:columns-2',
                3 => $direction === 'row' ? 'xl:grid-cols-3' : 'xl:columns-3',
                4 => $direction === 'row' ? 'xl:grid-cols-4' : 'xl:columns-4',
                5 => $direction === 'row' ? 'xl:grid-cols-5' : 'xl:columns-5',
                6 => $direction === 'row' ? 'xl:grid-cols-6' : 'xl:columns-6',
                7 => $direction === 'row' ? 'xl:grid-cols-7' : 'xl:columns-7',
                8 => $direction === 'row' ? 'xl:grid-cols-8' : 'xl:columns-8',
                9 => $direction === 'row' ? 'xl:grid-cols-9' : 'xl:columns-9',
                10 => $direction === 'row' ? 'xl:grid-cols-10' : 'xl:columns-10',
                11 => $direction === 'row' ? 'xl:grid-cols-11' : 'xl:columns-11',
                12 => $direction === 'row' ? 'xl:grid-cols-12' : 'xl:columns-12',
                default => $xl,
            } : null,
            $twoXl ? match ($twoXl) {
                1 => $direction === 'row' ? '2xl:grid-cols-1' : '2xl:columns-1',
                2 => $direction === 'row' ? '2xl:grid-cols-2' : '2xl:columns-2',
                3 => $direction === 'row' ? '2xl:grid-cols-3' : '2xl:columns-3',
                4 => $direction === 'row' ? '2xl:grid-cols-4' : '2xl:columns-4',
                5 => $direction === 'row' ? '2xl:grid-cols-5' : '2xl:columns-5',
                6 => $direction === 'row' ? '2xl:grid-cols-6' : '2xl:columns-6',
                7 => $direction === 'row' ? '2xl:grid-cols-7' : '2xl:columns-7',
                8 => $direction === 'row' ? '2xl:grid-cols-8' : '2xl:columns-8',
                9 => $direction === 'row' ? '2xl:grid-cols-9' : '2xl:columns-9',
                10 => $direction === 'row' ? '2xl:grid-cols-10' : '2xl:columns-10',
                11 => $direction === 'row' ? '2xl:grid-cols-11' : '2xl:columns-11',
                12 => $direction === 'row' ? '2xl:grid-cols-12' : '2xl:columns-12',
                default => $twoXl,
            } : null,
        ])
    }}
>
    {{ $slot }}
</div>
`;
        const output = `@props([
    'isGrid' => true,
    'default' => 1,
    'direction' => 'row',
    'sm' => null,
    'md' => null,
    'lg' => null,
    'xl' => null,
    'twoXl' => null,
])

<div
    {{
        $attributes->class([
            'grid' => $isGrid && $direction === 'row',
            $default ? match ($default) {
                1 => $direction === 'row' ? 'grid-cols-1' : 'columns-1',
                2 => $direction === 'row' ? 'grid-cols-2' : 'columns-2',
                3 => $direction === 'row' ? 'grid-cols-3' : 'columns-3',
                4 => $direction === 'row' ? 'grid-cols-4' : 'columns-4',
                5 => $direction === 'row' ? 'grid-cols-5' : 'columns-5',
                6 => $direction === 'row' ? 'grid-cols-6' : 'columns-6',
                7 => $direction === 'row' ? 'grid-cols-7' : 'columns-7',
                8 => $direction === 'row' ? 'grid-cols-8' : 'columns-8',
                9 => $direction === 'row' ? 'grid-cols-9' : 'columns-9',
                10 => $direction === 'row' ? 'grid-cols-10' : 'columns-10',
                11 => $direction === 'row' ? 'grid-cols-11' : 'columns-11',
                12 => $direction === 'row' ? 'grid-cols-12' : 'columns-12',
                default => $default,
            } : null,
            $sm ? match ($sm) {
                1 => $direction === 'row' ? 'sm:grid-cols-1' : 'sm:columns-1',
                2 => $direction === 'row' ? 'sm:grid-cols-2' : 'sm:columns-2',
                3 => $direction === 'row' ? 'sm:grid-cols-3' : 'sm:columns-3',
                4 => $direction === 'row' ? 'sm:grid-cols-4' : 'sm:columns-4',
                5 => $direction === 'row' ? 'sm:grid-cols-5' : 'sm:columns-5',
                6 => $direction === 'row' ? 'sm:grid-cols-6' : 'sm:columns-6',
                7 => $direction === 'row' ? 'sm:grid-cols-7' : 'sm:columns-7',
                8 => $direction === 'row' ? 'sm:grid-cols-8' : 'sm:columns-8',
                9 => $direction === 'row' ? 'sm:grid-cols-9' : 'sm:columns-9',
                10 => $direction === 'row' ? 'sm:grid-cols-10' : 'sm:columns-10',
                11 => $direction === 'row' ? 'sm:grid-cols-11' : 'sm:columns-11',
                12 => $direction === 'row' ? 'sm:grid-cols-12' : 'sm:columns-12',
                default => $sm,
            } : null,
            $md ? match ($md) {
                1 => $direction === 'row' ? 'md:grid-cols-1' : 'md:columns-1',
                2 => $direction === 'row' ? 'md:grid-cols-2' : 'md:columns-2',
                3 => $direction === 'row' ? 'md:grid-cols-3' : 'md:columns-3',
                4 => $direction === 'row' ? 'md:grid-cols-4' : 'md:columns-4',
                5 => $direction === 'row' ? 'md:grid-cols-5' : 'md:columns-5',
                6 => $direction === 'row' ? 'md:grid-cols-6' : 'md:columns-6',
                7 => $direction === 'row' ? 'md:grid-cols-7' : 'md:columns-7',
                8 => $direction === 'row' ? 'md:grid-cols-8' : 'md:columns-8',
                9 => $direction === 'row' ? 'md:grid-cols-9' : 'md:columns-9',
                10 => $direction === 'row' ? 'md:grid-cols-10' : 'md:columns-10',
                11 => $direction === 'row' ? 'md:grid-cols-11' : 'md:columns-11',
                12 => $direction === 'row' ? 'md:grid-cols-12' : 'md:columns-12',
                default => $md,
            } : null,
            $lg ? match ($lg) {
                1 => $direction === 'row' ? 'lg:grid-cols-1' : 'lg:columns-1',
                2 => $direction === 'row' ? 'lg:grid-cols-2' : 'lg:columns-2',
                3 => $direction === 'row' ? 'lg:grid-cols-3' : 'lg:columns-3',
                4 => $direction === 'row' ? 'lg:grid-cols-4' : 'lg:columns-4',
                5 => $direction === 'row' ? 'lg:grid-cols-5' : 'lg:columns-5',
                6 => $direction === 'row' ? 'lg:grid-cols-6' : 'lg:columns-6',
                7 => $direction === 'row' ? 'lg:grid-cols-7' : 'lg:columns-7',
                8 => $direction === 'row' ? 'lg:grid-cols-8' : 'lg:columns-8',
                9 => $direction === 'row' ? 'lg:grid-cols-9' : 'lg:columns-9',
                10 => $direction === 'row' ? 'lg:grid-cols-10' : 'lg:columns-10',
                11 => $direction === 'row' ? 'lg:grid-cols-11' : 'lg:columns-11',
                12 => $direction === 'row' ? 'lg:grid-cols-12' : 'lg:columns-12',
                default => $lg,
            } : null,
            $xl ? match ($xl) {
                1 => $direction === 'row' ? 'xl:grid-cols-1' : 'xl:columns-1',
                2 => $direction === 'row' ? 'xl:grid-cols-2' : 'xl:columns-2',
                3 => $direction === 'row' ? 'xl:grid-cols-3' : 'xl:columns-3',
                4 => $direction === 'row' ? 'xl:grid-cols-4' : 'xl:columns-4',
                5 => $direction === 'row' ? 'xl:grid-cols-5' : 'xl:columns-5',
                6 => $direction === 'row' ? 'xl:grid-cols-6' : 'xl:columns-6',
                7 => $direction === 'row' ? 'xl:grid-cols-7' : 'xl:columns-7',
                8 => $direction === 'row' ? 'xl:grid-cols-8' : 'xl:columns-8',
                9 => $direction === 'row' ? 'xl:grid-cols-9' : 'xl:columns-9',
                10 => $direction === 'row' ? 'xl:grid-cols-10' : 'xl:columns-10',
                11 => $direction === 'row' ? 'xl:grid-cols-11' : 'xl:columns-11',
                12 => $direction === 'row' ? 'xl:grid-cols-12' : 'xl:columns-12',
                default => $xl,
            } : null,
            $twoXl ? match ($twoXl) {
                1 => $direction === 'row' ? '2xl:grid-cols-1' : '2xl:columns-1',
                2 => $direction === 'row' ? '2xl:grid-cols-2' : '2xl:columns-2',
                3 => $direction === 'row' ? '2xl:grid-cols-3' : '2xl:columns-3',
                4 => $direction === 'row' ? '2xl:grid-cols-4' : '2xl:columns-4',
                5 => $direction === 'row' ? '2xl:grid-cols-5' : '2xl:columns-5',
                6 => $direction === 'row' ? '2xl:grid-cols-6' : '2xl:columns-6',
                7 => $direction === 'row' ? '2xl:grid-cols-7' : '2xl:columns-7',
                8 => $direction === 'row' ? '2xl:grid-cols-8' : '2xl:columns-8',
                9 => $direction === 'row' ? '2xl:grid-cols-9' : '2xl:columns-9',
                10 => $direction === 'row' ? '2xl:grid-cols-10' : '2xl:columns-10',
                11 => $direction === 'row' ? '2xl:grid-cols-11' : '2xl:columns-11',
                12 => $direction === 'row' ? '2xl:grid-cols-12' : '2xl:columns-12',
                default => $twoXl,
            } : null,
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