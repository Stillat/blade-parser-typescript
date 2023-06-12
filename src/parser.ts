// Internal file used to debug the parser.

import { formatBladeStringWithPint } from './formatting/prettier/utils';

const input = `

<div
x-ignore
ax-load
ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('file-upload', 'filament/forms') }}"
x-data="fileUploadFormComponent({
acceptedFileTypes: @js($getAcceptedFileTypes()),
deleteUploadedFileUsing: async (fileKey) => {
return await $wire.deleteUploadedFile(@js($statePath), fileKey)
},
getUploadedFilesUsing: async () => {
return await $wire.getFormUploadedFiles(@js($statePath))
},
uploadUsing: (fileKey, file, success, error, progress) => {
$wire.upload(\`{{ \$statePath }}.\${fileKey}\`, file, () => {
success(fileKey)
}, error, progress)
},
})"
wire:ignore
>

</div>

`


console.log(formatBladeStringWithPint(input));

debugger;
