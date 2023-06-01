// Internal file used to debug the parser.

import { StringRemover } from './parser/stringRemover';

const remover = new StringRemover();

const input = `
<div @class(['flex text-center'])></div>

@if ('flex text-center' != 'that')

@endif
`;


remover.remove(input);
console.log(remover.getStrings());

debugger;
