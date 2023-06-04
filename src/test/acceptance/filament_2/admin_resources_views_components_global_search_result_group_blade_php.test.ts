import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: admin_resources_views_components_global_search_result_group_blade_php', () => {
    test('pint: it can format admin_resources_views_components_global_search_result_group_blade_php', () => {
        const input = `@props([
    'label',
    'results',
])

<ul {{ $attributes->class([
    'filament-global-search-result-group divide-y',
    'dark:divide-gray-700' => config('filament.dark_mode'),
]) }}>
    <li class="sticky top-0 z-10">
        <header @class([
            'px-6 py-2 bg-gray-50/80 backdrop-blur-xl backdrop-saturate-150',
            'dark:bg-gray-700' => config('filament.dark_mode'),
        ])>
            <p @class([
                'text-xs font-bold tracking-wider text-gray-500 uppercase',
                'dark:text-gray-400' => config('filament.dark_mode'),
            ])>
                {{ $label }}
            </p>
        </header>
    </li>

    @foreach ($results as $result)
        <x-filament::global-search.result
            :actions="$result->actions"
            :details="$result->details"
            :title="$result->title"
            :url="$result->url"
        />
    @endforeach
</ul>
`;
        const output = `@props([
    'label',
    'results',
])

<ul
    {{
        $attributes->class([
            'filament-global-search-result-group divide-y',
            'dark:divide-gray-700' => config('filament.dark_mode'),
        ])
    }}
>
    <li class="sticky top-0 z-10">
        <header
            @class([
                'px-6 py-2 bg-gray-50/80 backdrop-blur-xl backdrop-saturate-150',
                'dark:bg-gray-700' => config('filament.dark_mode'),
            ])
        >
            <p
                @class([
                    'text-xs font-bold tracking-wider text-gray-500 uppercase',
                    'dark:text-gray-400' => config('filament.dark_mode'),
                ])
            >
                {{ $label }}
            </p>
        </header>
    </li>

    @foreach ($results as $result)
        <x-filament::global-search.result
            :actions="$result->actions"
            :details="$result->details"
            :title="$result->title"
            :url="$result->url"
        />
    @endforeach
</ul>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});