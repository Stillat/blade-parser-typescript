import { formatBladeStringWithPint } from './formatting/prettier/utils';

// Internal file used to debug the parser.
const input = `
<div
    class="my-4"
    @unless(config('filament-media-library.settings.show-upload-box-by-default')) x-foo
         x-show="showUploadBox"
         x-collapse
         x-cloak
     @endunless
>
<p>Hello, world!</p>
</div>

<div>
<div>
<div
    class="my-4"
    @unless(config('filament-media-library.settings.show-upload-box-by-default')) x-foo
         x-show="showUploadBox"
         x-collapse
         x-cloak
     @endunless
>
<p>Hello, world!</p>
</div>
</div>
</div>
`;


console.log(formatBladeStringWithPint(input));

debugger;
