import { BladeDocument } from './document/bladeDocument';
import { PintTransformer } from './document/pintTransformer';
import * as fs from 'fs';
import { StringUtilities } from './utilities/stringUtilities';
import { formatBladeString, formatBladeStringWithPint } from './formatting/prettier/utils';
const { execSync } = require('child_process');

// Internal file used to debug the parser.
const input = `@props([
    'actions' => [],
    'url',
])`;


console.log(formatBladeStringWithPint(input));

//console.log(theRes, resultMapping);
debugger;



