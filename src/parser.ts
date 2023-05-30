// Internal file used to debug the parser.

import { setPrettierFilePath } from './formatting/optionDiscovery';
import { formatBladeString, formatBladeStringWithPint } from './formatting/prettier/utils';
import { formatBladeFilesInDirecetory } from './utilities/validationUtilities';

const template = `<?php
    fn () => true;
?>`;
console.log(formatBladeStringWithPint(template));

debugger;
