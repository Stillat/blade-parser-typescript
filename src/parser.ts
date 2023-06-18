import { formatBladeStringWithPint } from './formatting/prettier/utils';

// Internal file used to debug the parser.
const input = `<h2 {{ $attributes->class(['filament-modal-heading text-xl font-medium tracking-tight']) }}>
    {{ $slot }}
</h2>
`;
console.log(formatBladeStringWithPint(input));
debugger;
