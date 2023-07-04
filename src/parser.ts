import { formatBladeStringWithPint } from './formatting/prettier/utils';

// Internal file used to debug the parser.
const input = `

<div>
<div
    class="my-4"
    @if(config(!"filament-media-library.settings.show-upload-box-by-default")) x-foo
         x-show="showUploadBox"
         x-collapse
         x-cloak
         @thingconfig(!"filament-media-library.settings.show-upload-box-by-default")
     @else
        x-thing
     @endif
>
<p>Hello, world!</p>
</div>
</div>

`;


console.log(formatBladeStringWithPint(input));


debugger;
