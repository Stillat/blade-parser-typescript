import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_layouts_app_topbar_breadcrumbs_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_layouts_app_topbar_breadcrumbs_blade_php', async () => {
        const input = `@props([
    'breadcrumbs' => [],
])

<div {{ $attributes->class(['filament-breadcrumbs flex-1']) }}>
    <ul @class([
        'hidden gap-4 items-center font-medium text-sm lg:flex',
        'dark:text-white' => config('filament.dark_mode'),
    ])>
        @foreach ($breadcrumbs as $url => $label)
            <li>
                <a
                    href="{{ is_int($url) ? '#' : $url }}"
                    @class([
                        'text-gray-500' => $loop->last && (! $loop->first),
                        'dark:text-gray-300' => ((! $loop->last) || $loop->first) && config('filament.dark_mode'),
                        'dark:text-gray-400' => $loop->last && (! $loop->first) && config('filament.dark_mode'),
                    ])
                >
                    {{ $label }}
                </a>
            </li>

            @if (! $loop->last)
                <li @class([
                    'h-6 border-r border-gray-300 -skew-x-12',
                    'dark:border-gray-500' => config('filament.dark_mode'),
                ])></li>
            @endif
        @endforeach
    </ul>
</div>
`;
        const output = `@props([
    'breadcrumbs' => [],
])

<div {{ $attributes->class(['filament-breadcrumbs flex-1']) }}>
    <ul
        @class([
            'hidden items-center gap-4 text-sm font-medium lg:flex',
            'dark:text-white' => config('filament.dark_mode'),
        ])
    >
        @foreach ($breadcrumbs as $url => $label)
            <li>
                <a
                    href="{{ is_int($url) ? '#' : $url }}"
                    @class([
                        'text-gray-500' => $loop->last && (! $loop->first),
                        'dark:text-gray-300' => ((! $loop->last) || $loop->first) && config('filament.dark_mode'),
                        'dark:text-gray-400' => $loop->last && (! $loop->first) && config('filament.dark_mode'),
                    ])
                >
                    {{ $label }}
                </a>
            </li>

            @if (! $loop->last)
                <li
                    @class([
                        'h-6 -skew-x-12 border-r border-gray-300',
                        'dark:border-gray-500' => config('filament.dark_mode'),
                    ])
                ></li>
            @endif
        @endforeach
    </ul>
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});