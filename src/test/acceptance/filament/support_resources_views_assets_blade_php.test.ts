import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: support_resources_views_assets_blade_php', () => {
    test('pint: it can format support_resources_views_assets_blade_php', () => {
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

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});