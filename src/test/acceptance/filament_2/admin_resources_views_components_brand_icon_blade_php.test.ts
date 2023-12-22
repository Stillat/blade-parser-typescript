import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_brand_icon_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_brand_icon_blade_php', async () => {
        const input = `@if (filled($brand = config('filament.brand')))
    <div @class([
        'filament-brand text-xl font-bold tracking-tight',
        'dark:text-white' => config('filament.dark_mode'),
    ])>
        {{
            \\Illuminate\\Support\\Str::of($brand)
                ->snake()
                ->upper()
                ->explode('_')
                ->map(fn (string $string) => \\Illuminate\\Support\\Str::substr($string, 0, 1))
                ->take(2)
                ->implode('')
        }}
    </div>
@endif
`;
        const output = `@if (filled($brand = config('filament.brand')))
    <div
        @class([
            'filament-brand text-xl font-bold tracking-tight',
            'dark:text-white' => config('filament.dark_mode'),
        ])
    >
        {{
            \\Illuminate\\Support\\Str::of($brand)
                ->snake()
                ->upper()
                ->explode('_')
                ->map(fn (string $string) => \\Illuminate\\Support\\Str::substr($string, 0, 1))
                ->take(2)
                ->implode('')
        }}
    </div>
@endif
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});