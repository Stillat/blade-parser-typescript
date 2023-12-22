import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: support_resources_views_assets_blade_php', () => {
    setupTestHooks();
    test('pint: it can format support_resources_views_assets_blade_php', async () => {
        const input = `@if (isset($data))
    <script>
        window.filamentData = @js($data);
    </script>
@endif

@foreach ($assets as $asset)
    {{ $asset->getHtml() }}
@endforeach
`;
        const output = `@if (isset($data))
    <script>
        window.filamentData = @js($data);
    </script>
@endif

@foreach ($assets as $asset)
    {{ $asset->getHtml() }}
@endforeach
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});