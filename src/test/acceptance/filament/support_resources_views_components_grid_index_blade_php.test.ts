import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_components_grid_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_components_grid_index_blade_php', async () => {
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
    style="
        @if ($default) --cols-default: repeat({{ $default }}, minmax(0, 1fr)); @endif
        @if ($sm) --cols-sm: repeat({{ $sm }}, minmax(0, 1fr)); @endif
        @if ($md) --cols-md: repeat({{ $md }}, minmax(0, 1fr)); @endif
        @if ($lg) --cols-lg: repeat({{ $lg }}, minmax(0, 1fr)); @endif
        @if ($xl) --cols-xl: repeat({{ $xl }}, minmax(0, 1fr)); @endif
        @if ($twoXl) --cols-2xl: repeat({{ $twoXl }}, minmax(0, 1fr)); @endif
    "
    {{ $attributes->class([
        'grid' => $isGrid && $direction === 'row',
        'grid-cols-[--cols-default]' => $default && ($direction === 'row'),
        'columns-[--cols-default]' => $default && ($direction === 'column'),
        'sm:grid-cols-[--cols-sm]' => $sm && ($direction === 'row'),
        'sm:columns-[--cols-sm]' => $sm && ($direction === 'column'),
        'md:grid-cols-[--cols-md]' => $md && ($direction === 'row'),
        'md:columns-[--cols-md]' => $md && ($direction === 'column'),
        'lg:grid-cols-[--cols-lg]' => $lg && ($direction === 'row'),
        'lg:columns-[--cols-lg]' => $lg && ($direction === 'column'),
        'xl:grid-cols-[--cols-xl]' => $xl && ($direction === 'row'),
        'xl:columns-[--cols-xl]' => $xl && ($direction === 'column'),
        '2xl:grid-cols-[--cols-2xl]' => $twoXl && ($direction === 'row'),
        '2xl:columns-[--cols-2xl]' => $twoXl && ($direction === 'column'),
    ]) }}
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
    style="
        @if ($default) --cols-default: repeat({{ $default }}, minmax(0, 1fr)); @endif
        @if ($sm) --cols-sm: repeat({{ $sm }}, minmax(0, 1fr)); @endif
        @if ($md) --cols-md: repeat({{ $md }}, minmax(0, 1fr)); @endif
        @if ($lg) --cols-lg: repeat({{ $lg }}, minmax(0, 1fr)); @endif
        @if ($xl) --cols-xl: repeat({{ $xl }}, minmax(0, 1fr)); @endif
        @if ($twoXl) --cols-2xl: repeat({{ $twoXl }}, minmax(0, 1fr)); @endif
    "
    {{
        $attributes->class([
            'grid' => $isGrid && $direction === 'row',
            'grid-cols-[--cols-default]' => $default && ($direction === 'row'),
            'columns-[--cols-default]' => $default && ($direction === 'column'),
            'sm:grid-cols-[--cols-sm]' => $sm && ($direction === 'row'),
            'sm:columns-[--cols-sm]' => $sm && ($direction === 'column'),
            'md:grid-cols-[--cols-md]' => $md && ($direction === 'row'),
            'md:columns-[--cols-md]' => $md && ($direction === 'column'),
            'lg:grid-cols-[--cols-lg]' => $lg && ($direction === 'row'),
            'lg:columns-[--cols-lg]' => $lg && ($direction === 'column'),
            'xl:grid-cols-[--cols-xl]' => $xl && ($direction === 'row'),
            'xl:columns-[--cols-xl]' => $xl && ($direction === 'column'),
            '2xl:grid-cols-[--cols-2xl]' => $twoXl && ($direction === 'row'),
            '2xl:columns-[--cols-2xl]' => $twoXl && ($direction === 'column'),
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