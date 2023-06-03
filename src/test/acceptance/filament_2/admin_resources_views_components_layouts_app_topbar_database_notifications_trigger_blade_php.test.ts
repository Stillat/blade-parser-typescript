import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Accpetance: admin_resources_views_components_layouts_app_topbar_database_notifications_trigger_blade_php', () => {
    test('pint: it can format admin_resources_views_components_layouts_app_topbar_database_notifications_trigger_blade_php', () => {
        const input = `<x-filament::icon-button
    :label="__('filament::layout.buttons.database_notifications.label')"
    icon="heroicon-o-bell"
    :color="$unreadNotificationsCount ? 'primary' : 'secondary'"
    :indicator="$unreadNotificationsCount"
    class="ml-4 -mr-1 rtl:-ml-1 rtl:mr-4"
/>
`;
        const output = `<x-filament::icon-button
    :label="__('filament::layout.buttons.database_notifications.label')"
    icon="heroicon-o-bell"
    :color="$unreadNotificationsCount ? 'primary' : 'secondary'"
    :indicator="$unreadNotificationsCount"
    class="-mr-1 ml-4 rtl:-ml-1 rtl:mr-4"
/>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});