import assert from 'assert';
import { formatBladeStringWithPint } from '../../../formatting/prettier/utils.js';
import { StringUtilities } from '../../../utilities/stringUtilities.js';
import { setupTestHooks } from '../../../test/testUtils/formatting.js';

suite('Pint Transformer Acceptance: admin_resources_views_components_resources_relation_managers_index_blade_php', () => {
    setupTestHooks();
    test('pint: it can format admin_resources_views_components_resources_relation_managers_index_blade_php', async () => {
        const input = `@props([
    'activeManager',
    'form' => null,
    'formTabLabel' => null,
    'managers',
    'ownerRecord',
    'pageClass',
])

<div class="filament-resources-relation-managers-container space-y-2">
    @if ((count($managers) > 1) || $form)
        <div class="flex justify-center">
            <x-filament::tabs>
                @php
                    $tabs = $managers;

                    if ($form) {
                        $tabs = array_replace([null => null], $tabs);
                    }
                @endphp

                @foreach ($tabs as $tabKey => $manager)
                    @php
                        $activeManager = strval($activeManager);
                        $tabKey = strval($tabKey);
                    @endphp

                    <button
                        wire:click="$set('activeRelationManager', {{ filled($tabKey) ? "'{$tabKey}'" : 'null' }})"
                        @if ($activeManager === $tabKey)
                            aria-selected
                        @endif
                        role="tab"
                        type="button"
                        @class([
                            'flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-primary-600 focus:ring-inset',
                            'hover:text-gray-800 focus:text-primary-600' => $activeManager !== $tabKey,
                            'dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400' => ($activeManager !== $tabKey) && config('filament.dark_mode'),
                            'text-primary-600 shadow bg-white' => $activeManager === $tabKey,
                            'dark:text-white dark:bg-primary-600' => ($activeManager === $tabKey) && config('filament.dark_mode'),
                        ])
                    >
                        @if (filled($tabKey))
                            {{ $manager instanceof \\Filament\\Resources\\RelationManagers\\RelationGroup ? $manager->getLabel() : $manager::getTitleForRecord($ownerRecord) }}
                        @elseif ($form)
                            {{ $formTabLabel }}
                        @endif
                    </button>
                @endforeach
            </x-filament::tabs>
        </div>
    @endif

    @if (filled($activeManager) && isset($managers[$activeManager]))
        <div
            @if (count($managers) > 1)
                id="relationManager{{ ucfirst($activeManager) }}"
                role="tabpanel"
                tabindex="0"
            @endif
            class="space-y-4 outline-none"
        >
            @if ($managers[$activeManager] instanceof \\Filament\\Resources\\RelationManagers\\RelationGroup)
                @foreach($managers[$activeManager]->getManagers(ownerRecord: $ownerRecord) as $groupedManager)
                    @livewire(\\Livewire\\Livewire::getAlias($groupedManager, $groupedManager::getName()), ['ownerRecord' => $ownerRecord], key($groupedManager))
                @endforeach
            @else
                @php
                    $manager = $managers[$activeManager];
                @endphp

                @livewire(\\Livewire\\Livewire::getAlias($manager, $manager::getName()), ['ownerRecord' => $ownerRecord, 'pageClass' => $pageClass], key($manager))
            @endif
        </div>
    @elseif ($form)
        {{ $form }}
    @endif
</div>
`;
        const output = `@props([
    'activeManager',
    'form' => null,
    'formTabLabel' => null,
    'managers',
    'ownerRecord',
    'pageClass',
])

<div class="filament-resources-relation-managers-container space-y-2">
    @if ((count($managers) > 1) || $form)
        <div class="flex justify-center">
            <x-filament::tabs>
                @php
                    $tabs = $managers;

                    if ($form) {
                        $tabs = array_replace([null => null], $tabs);
                    }
                @endphp

                @foreach ($tabs as $tabKey => $manager)
                    @php
                        $activeManager = strval($activeManager);
                        $tabKey = strval($tabKey);
                    @endphp

                    <button
                        wire:click="$set('activeRelationManager', {{ filled($tabKey) ? "'{$tabKey}'" : 'null' }})"
                        @if ($activeManager === $tabKey)
                            aria-selected
                        @endif
                        role="tab"
                        type="button"
                        @class([
                            'focus:ring-primary-600 flex h-8 items-center whitespace-nowrap rounded-lg px-5 font-medium outline-none focus:ring-2 focus:ring-inset',
                            'focus:text-primary-600 hover:text-gray-800' => $activeManager !== $tabKey,
                            'dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400' => ($activeManager !== $tabKey) && config('filament.dark_mode'),
                            'text-primary-600 bg-white shadow' => $activeManager === $tabKey,
                            'dark:bg-primary-600 dark:text-white' => ($activeManager === $tabKey) && config('filament.dark_mode'),
                        ])
                    >
                        @if (filled($tabKey))
                            {{ $manager instanceof \\Filament\\Resources\\RelationManagers\\RelationGroup ? $manager->getLabel() : $manager::getTitleForRecord($ownerRecord) }}
                        @elseif ($form)
                            {{ $formTabLabel }}
                        @endif
                    </button>
                @endforeach
            </x-filament::tabs>
        </div>
    @endif

    @if (filled($activeManager) && isset($managers[$activeManager]))
        <div
            @if (count($managers) > 1)
                id="relationManager{{ ucfirst($activeManager) }}"
                role="tabpanel"
                tabindex="0"
            @endif
            class="space-y-4 outline-none"
        >
            @if ($managers[$activeManager] instanceof \\Filament\\Resources\\RelationManagers\\RelationGroup)
                @foreach ($managers[$activeManager]->getManagers(ownerRecord: $ownerRecord) as $groupedManager)
                    @livewire(\\Livewire\\Livewire::getAlias($groupedManager, $groupedManager::getName()), ['ownerRecord' => $ownerRecord], key($groupedManager))
                @endforeach
            @else
                @php
                    $manager = $managers[$activeManager];
                @endphp

                @livewire(\\Livewire\\Livewire::getAlias($manager, $manager::getName()), ['ownerRecord' => $ownerRecord, 'pageClass' => $pageClass], key($manager))
            @endif
        </div>
    @elseif ($form)
        {{ $form }}
    @endif
</div>
`;

        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(input)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
        assert.strictEqual(StringUtilities.normalizeLineEndings((await formatBladeStringWithPint(output)).trim()), StringUtilities.normalizeLineEndings(output.trim()));
    }).timeout(30000);
});