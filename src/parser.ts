// Internal file used to debug the parser.

import { formatBladeString } from './formatting/prettier/utils';

const input = `

<div>
@some_directive
</div>

`

console.log(formatBladeString(input));

debugger;
