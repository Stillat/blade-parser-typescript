import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: panels_resources_views_components_layouts_app_topbar_database_notifications_trigger_blade_php', () => {
    test('pint: it can format panels_resources_views_components_layouts_app_topbar_database_notifications_trigger_blade_php', () => {
        const input = `<x-filament::icon-button
    :label="__('filament::layout.buttons.database_notifications.label')"
    icon="heroicon-o-bell"
    icon-alias="app::layout.database-notifications.trigger"
    icon-size="lg"
    color="gray"
    :indicator="$unreadNotificationsCount"
    class="ms-4 -me-1"
/>
`;
        const output = `<x-filament::icon-button
    :label="__('filament::layout.buttons.database_notifications.label')"
    icon="heroicon-o-bell"
    icon-alias="app::layout.database-notifications.trigger"
    icon-size="lg"
    color="gray"
    :indicator="$unreadNotificationsCount"
    class="-me-1 ms-4"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});