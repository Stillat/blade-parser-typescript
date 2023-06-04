import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';

suite('Class Strings Emulation', () => {
    test('it can safely transform strings', () => {
        const input = `

<button class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">...</button>

@php

$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ? 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' : 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';

$classes = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';

if ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    $one = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
} elseif ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    $two = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
} else if ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    if ($anotherThing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
        $three = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    } else {
        $four = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    }
} else {
    $five = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
}

@endphp

@classes([
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800'
])

{{
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ? 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' : 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800'
}}

@if ('text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800')
<button class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">...</button>

@elseif('text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800')
<button class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">...</button>

@endif

<?php

$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ? 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' : 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$classes = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';

if ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    $one = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
} elseif ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    $two = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
} else if ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    if ($anotherThing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
        $three = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    } else {
        $four = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    }
} else {
    $five = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
}

?>
`;
        const expected = `<button
    class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
>
    ...
</button>

@php
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ? 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3' : 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';

    $classes = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';

    if ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
        $one = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
    } elseif ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
        $two = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
    } elseif ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
        if ($anotherThing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
            $three = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
        } else {
            $four = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
        }
    } else {
        $five = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
    }
@endphp

@classes([
    'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3',
])

{{ 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ? 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3' : 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3' }}

@if ('text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800')
    <button
        class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
    >
        ...
    </button>
@elseif ('text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800')
    <button
        class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
    >
        ...
    </button>
@endif

<?php

$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ? 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3' : 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
$classes = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';

if ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    $one = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
} elseif ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    $two = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
} elseif ($thing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
    if ($anotherThing == 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800') {
        $three = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
    } else {
        $four = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
    }
} else {
    $five = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
}

?>
`;
        assert.strictEqual(formatBladeStringWithPint(input), expected);
    });
});