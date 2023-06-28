import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils';
import { StringUtilities } from '../../../utilities/stringUtilities';

suite('Pint Transformer Acceptance: panels_resources_views_resources_pages_list_records_blade_php', () => {
    test('pint: it can format panels_resources_views_resources_pages_list_records_blade_php', () => {
        const input = `<x-filament::page @class([
    'filament-resources-list-records-page',
    'filament-resources-' . str_replace('/', '-', $this->getResource()::getSlug()),
])>
    @if (count($tabs = $this->getTabs()))
        <div class="flex justify-center">
            <x-filament::tabs>
                @foreach ($tabs as $tabKey => $tab)
                    @php
                        $activeTab = strval($activeTab);
                        $tabKey = strval($tabKey);
                    @endphp

                    <x-filament::tabs.item
                        :wire:click="'$set(\\'activeTab\\', ' . (filled($tabKey) ? ('\\'' . $tabKey . '\\'') : 'null') . ')'"
                        :active="$activeTab === $tabKey"
                        :badge="$tab->getBadge()"
                        :icon="$tab->getIcon()"
                        :icon-color="$tab->getIconColor()"
                        :icon-position="$tab->getIconPosition()"
                    >
                        {{ $tab->getLabel() ?? $this->generateTabLabel($tabKey) }}
                    </x-filament::tabs.item>
                @endforeach
            </x-filament::tabs>
        </div>
    @endif

    {{ filament()->renderHook('resource.pages.list-records.table.start') }}

    {{ $this->table }}

    {{ filament()->renderHook('resource.pages.list-records.table.end') }}
</x-filament::page>
`;
        const output = `<x-filament::page
    @class([
        'filament-resources-list-records-page',
        'filament-resources-'.str_replace('/', '-', $this->getResource()::getSlug()),
    ])
>
    @if (count($tabs = $this->getTabs()))
        <div class="flex justify-center">
            <x-filament::tabs>
                @foreach ($tabs as $tabKey => $tab)
                    @php
                        $activeTab = strval($activeTab);
                        $tabKey = strval($tabKey);
                    @endphp

                    <x-filament::tabs.item
                        :wire:click="'$set(\\'activeTab\\', '.(filled($tabKey) ? ('\\''.$tabKey.'\\'') : 'null').')'"
                        :active="$activeTab === $tabKey"
                        :badge="$tab->getBadge()"
                        :icon="$tab->getIcon()"
                        :icon-color="$tab->getIconColor()"
                        :icon-position="$tab->getIconPosition()"
                    >
                        {{ $tab->getLabel() ?? $this->generateTabLabel($tabKey) }}
                    </x-filament::tabs.item>
                @endforeach
            </x-filament::tabs>
        </div>
    @endif

    {{ filament()->renderHook('resource.pages.list-records.table.start') }}

    {{ $this->table }}

    {{ filament()->renderHook('resource.pages.list-records.table.end') }}
</x-filament::page>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(input).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings(formatBladeStringWithPint(output).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});