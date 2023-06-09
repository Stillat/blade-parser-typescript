import { AttributeRangeRemover } from './document/attributeRangeRemover';
import { DocumentParser } from './parser/documentParser';
import { FragmentsParser } from './parser/fragmentsParser';

// Internal file used to debug the parser.
const input = `   <div
x-ignore
ax-load
ax-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('file-upload', 'filament/forms') }}"
x-data="fileUploadFormComponent({
    acceptedFileTypes: @js($getAcceptedFileTypes()),
    deleteUploadedFileUsing: async (fileKey) => {
        return await $wire.deleteUploadedFile(@js($statePath), fileKey)
    },
    getUploadedFilesUsing: async () => {
        return await $wire.getFormUploadedFiles(@js($statePath))
    },
    uploadUsing: (fileKey, file, success, error, progress) => {
        $wire.upload(\`{{ $statePath }}.\${fileKey}\`, file, () => {
            success(fileKey)
        }, error, progress)
    },
})"
wire:ignore
x-data="1 + 1 + 1"
></div>


<div
x-ignore
ax-load
ax-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('file-upload', 'filament/forms') }}"
x-data="fileUploadFormComponent({
    acceptedFileTypes: @js($getAcceptedFileTypes()),
    deleteUploadedFileUsing: async (fileKey) => {
        return await $wire.deleteUploadedFile(@js($statePath), fileKey)
    },
    getUploadedFilesUsing: async () => {
        return await $wire.getFormUploadedFiles(@js($statePath))
    },
    uploadUsing: (fileKey, file, success, error, progress) => {
        $wire.upload(\`{{ $statePath }}.\${fileKey}\`, file, () => {
            success(fileKey)
        }, error, progress)
    },
})"
wire:ignore
x-data="1 + 1 + 1"
></div>
`;
const docParser = new DocumentParser();
docParser.setParseFragments(false);
docParser.parse(input);
// Need Blade feature indexes to skip over stuffs.
const bladeStuffs = docParser.getNodeIndexRanges();

const fragments = new FragmentsParser();
fragments.setIndexRanges(bladeStuffs);

fragments.setExtractAttributeNames(['x-data', 'ax-load-src']);
fragments.setExtractAttributes(true);


fragments.parse(input);
console.log(fragments.getExtractedAttributes());
debugger;
const arr = new AttributeRangeRemover();
const res1 = arr.remove(input, fragments.getExtractedAttributes());
console.log(res1);
debugger;
