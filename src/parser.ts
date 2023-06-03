// Internal file used to debug the parser.

import { PhpStructuresAnalyzer } from './analyzers/phpStructuresAnalyzer';
import { ClassStringEmulation } from './formatting/classStringEmulation';
import { formatBladeString, formatBladeStringWithPint } from './formatting/prettier/utils';
import { ClassEmulator } from './parser/classEmulator';
import { InlineStringParser } from './parser/inlineStringParser';

const phpCode = `<?php
    $classList = 'text-sm';

    if ((($somethingElse != 
        'text-lg'))) {
            if ((($somethingElse != 
                'text-lg'))) {
                    if ((($somethingElse != 
                        'text-lg'))) {
                        
                    }
            }
    }`;

const temp =    `
<x-alert @param($value   $= + $anotherValue) />
`;

console.log(formatBladeStringWithPint(temp));
debugger;
