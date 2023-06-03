// Internal file used to debug the parser.

import { PhpStructuresAnalyzer } from './analyzers/phpStructuresAnalyzer';
import { BladeDocument } from './document/bladeDocument';
import { ClassStringEmulation } from './formatting/classStringEmulation';
import { formatBladeString, formatBladeStringWithPint } from './formatting/prettier/utils';
import { ClassEmulator } from './parser/classEmulator';
import { InlineStringParser } from './parser/inlineStringParser';
const espree = require('espree');
const code = `


@php
    $shouldIgnore = "one \${three}";
@endphp

`;
console.log(formatBladeString(code));
debugger;
