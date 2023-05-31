import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: panels_resources_views_components_layouts_app_topbar_breadcrumbs_blade_php', () => {
    test('pint: it can format panels_resources_views_components_layouts_app_topbar_breadcrumbs_blade_php', () => {
        const input = `@props([
    'breadcrumbs' => [],
])

<div {{ $attributes->class(['hidden filament-breadcrumbs flex-1 lg:block']) }}>
    <ul class="flex items-center gap-3 text-sm font-medium dark:text-white">
        @foreach ($breadcrumbs as $url => $label)
            <li>
                <a
                    href="{{ is_int($url) ? '#' : $url }}"
                    @class([
                        'text-gray-500 dark:text-gray-400' => $loop->last && (! $loop->first),
                        'dark:text-gray-300' => (! $loop->last) || $loop->first,
                    ])
                >
                    {{ $label }}
                </a>
            </li>

            @if (! $loop->last)
                <li class="h-4 border-e border-gray-300 -skew-x-12 dark:border-gray-500"></li>
            @endif
        @endforeach
    </ul>
</div>
`;
        const output = `@props([
    'breadcrumbs' => [],
])

<div {{ $attributes->class(['hidden filament-breadcrumbs flex-1 lg:block']) }}>
    <ul class="flex items-center gap-3 text-sm font-medium dark:text-white">
        @foreach ($breadcrumbs as $url => $label)
            <li>
                <a
                    href="{{ is_int($url) ? '#' : $url }}"
                    @class([
                        'text-gray-500 dark:text-gray-400' => $loop->last && (! $loop->first),
                        'dark:text-gray-300' => (! $loop->last) || $loop->first,
                    ])
                >
                    {{ $label }}
                </a>
            </li>

            @if (! $loop->last)
                <li
                    class="h-4 border-e border-gray-300 -skew-x-12 dark:border-gray-500"
                ></li>
            @endif
        @endforeach
    </ul>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});