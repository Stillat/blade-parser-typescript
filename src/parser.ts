// Internal file used to debug the parser.

import { formatBladeStringWithPint } from './formatting/prettier/utils';
import { formatBladeFilesInDirecetory } from './utilities/validationUtilities';

const input = `

@props([
    'color' => 'primary',
    'icon' => null,
    'tag' => 'div',
])

<{{ $tag }} {{ $attributes->class([
    'filament-dropdown-header flex w-full gap-2 p-3 text-sm',
    match ($color) {
        'danger' => 'filament-dropdown-header-color-danger text-danger-600 dark:text-danger-400',
        'gray' => 'filament-dropdown-header-color-gray text-gray-700 dark:text-gray-200',
        'info' => 'filament-dropdown-header-color-info text-info-600 dark:text-info-400',
        'primary' => 'filament-dropdown-header-color-primary text-primary-600 dark:text-primary-400',
        'secondary' => 'filament-dropdown-header-color-secondary text-secondary-600 dark:text-secondary-400',
        'success' => 'filament-dropdown-header-color-success text-success-600 dark:text-success-400',
        'warning' => 'filament-dropdown-header-color-warning text-warning-600 dark:text-warning-400',
        default => $color,
    },
]) }}>

</{{ $tag }}>

`


console.log(formatBladeStringWithPint(input));

debugger;
