import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';
import { defaultSettings } from '../formatting/optionDiscovery';
import { classConfigFromObject } from '../formatting/classStringsConfig';

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

    test('it ignores various operators and assignments', () => {
        const input = `

        <?php
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' + $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' - $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' * $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' / $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' % $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ** $that;
        
        
        
        $thing += 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing .= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing *= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing /= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing %= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing &= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing |= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing ^= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing <<= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing >>= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        
        
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800'.$someValue;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' > 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' & 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' | 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ^ 2;
        $thing = ~'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' << 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' >> 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' === 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' < 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' != 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' <> 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' !== 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' >= 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' <= 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' && 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' and 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' || 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' or 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' xor 2;
        
        ?>
        
        @php
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' + $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' - $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' * $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' / $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' % $that;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ** $that;
        
        
        
        $thing += 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing .= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing *= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing /= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing %= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing &= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing |= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing ^= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing <<= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing >>= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        
        
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800'.$someValue;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' > 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' & 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' | 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ^ 2;
        $thing = ~'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' << 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' >> 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' === 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' < 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' != 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' <> 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' !== 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' >= 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' <= 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' && 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' and 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' || 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' or 2;
        $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' xor 2;
        
        
        @endphp
        `;
        const expected = `<?php
$thing = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' + $that;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' - $that;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' * $that;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' / $that;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' % $that;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ** $that;

$thing += 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$thing .= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$thing *= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$thing /= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$thing %= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$thing &= 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
$thing |= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$thing ^= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$thing <<= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
$thing >>= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';

$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800'.$someValue;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' > 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' & 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' | 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ^ 2;
$thing = ~'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' << 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' >> 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' === 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' < 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' != 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' != 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' !== 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' >= 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' <= 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' && 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' and 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' || 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' or 2;
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' xor 2;

?>

@php
    $thing = 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' + $that;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' - $that;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' * $that;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' / $that;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' % $that;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ** $that;

    $thing += 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    $thing .= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    $thing *= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    $thing /= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    $thing %= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    $thing &= 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
    $thing |= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    $thing ^= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    $thing <<= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';
    $thing >>= 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800';

    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800'.$someValue;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' > 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' & 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' | 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' ^ 2;
    $thing = ~'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' << 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' >> 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' == 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' === 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' < 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' != 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' != 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' !== 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' >= 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' <= 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' && 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' and 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' || 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' or 2;
    $thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800' xor 2;
@endphp
`;
        assert.strictEqual(formatBladeStringWithPint(input), expected);
    });

    test('it does not trash really long lines', () => {
        const input = `

<?php
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

?>

@class([
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
])

@php
$anotherThing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
@endphp
`;
        const expected = `<?php
$thing = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';

?>

@class([
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3',
])

@php
    $anotherThing = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3';
@endphp
`;
        assert.strictEqual(formatBladeStringWithPint(input), expected);
    });

    test('class strings can be disabled', () => {
        const input = `

<?php
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

?>

@class([
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
])

@php
$anotherThing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
@endphp
`;
        const expected = `<?php
$thing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

?>

@class([
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
])

@php
    $anotherThing = 'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
@endphp
`;
        assert.strictEqual(formatBladeStringWithPint(input, {
            ...defaultSettings,
            classStrings: classConfigFromObject({
                enabled: false
            })
        }), expected);
    });

    test('string include config works', () => {
        const input = `


@class([
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    '!tw text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
])

`;
        const expected = `@class([
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    '!tw aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3',
    'text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
])
`;
        assert.strictEqual(formatBladeStringWithPint(input, {
            ...defaultSettings,
            classStrings: classConfigFromObject({
                stringRules: {
                    includeWhen: [
                        /!tw/
                    ]
                }
            })
        }), expected);
    });

    test('class strings can be sorted inside alpinejs attribtues', () => {
        const input = `
<div>
<button
x-thing="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">
</button>
</div>
`;
        const out = `<div>
    <button
        x-thing="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
    ></button>
</div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('it ignores strings with leading or trailing whitespace', () => {
        const input = `@props([
    'product',
    'title' => $product->name . ' - ' . $product->category,
 ])`;
        const expected = `@props([
    'product',
    'title' => $product->name.' - '.$product->category,
])
`;
        assert.strictEqual(formatBladeStringWithPint(input), expected);
    });
});