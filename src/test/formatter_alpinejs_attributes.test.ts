import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils';
import { defaultSettings } from '../formatting/optionDiscovery';

suite('Alpine.js attribute formatting', () => {
    test('it does not trash formatting of embedded php', () => {
        const input = `
<button x-data="var thing = '<?php !$someoneWillDoThis ?> <?= $moreStuff ?>'"></button>
`;
        const out = `<button
    x-data="var thing = '<?php !$someoneWillDoThis ?> <?= $moreStuff ?>'"
></button>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('it does reasonable things with javascript inside attributes', () => {
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
                $wire.upload(\`{{ $statePath }}.\${fileKey}\`, file, () => {
                    success(fileKey)
                }, error, progress)
            },
        })"
        wire:ignore
    >
</div>
`;
        const out = `<div
    x-ignore
    ax-load
    ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('file-upload', 'filament/forms') }}"
    x-data="
        fileUploadFormComponent({
            acceptedFileTypes: @js($getAcceptedFileTypes()),
            deleteUploadedFileUsing: async (fileKey) => {
                return await $wire.deleteUploadedFile(@js($statePath), fileKey);
            },
            getUploadedFilesUsing: async () => {
                return await $wire.getFormUploadedFiles(@js($statePath));
            },
            uploadUsing: (fileKey, file, success, error, progress) => {
                $wire.upload(
                    \`{{ $statePath }}.\${fileKey}\`,
                    file,
                    () => {
                        success(fileKey);
                    },
                    error,
                    progress
                );
            },
        })
    "
    wire:ignore
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input), out);
    });

    test('js prettier options can be changed', () => {
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
                $wire.upload(\`{{ $statePath }}.\${fileKey}\`, file, () => {
                    success(fileKey)
                }, error, progress)
            },
        })"
        wire:ignore
    >
</div>
`;
        const out = `<div
    x-ignore
    ax-load
    ax-load-src="{{ \\Filament\\Support\\Facades\\FilamentAsset::getAlpineComponentSrc('file-upload', 'filament/forms') }}"
    x-data="
        fileUploadFormComponent({
            acceptedFileTypes: @js($getAcceptedFileTypes()),
            deleteUploadedFileUsing: async (fileKey) => {
                return await $wire.deleteUploadedFile(@js($statePath), fileKey)
            },
            getUploadedFilesUsing: async () => {
                return await $wire.getFormUploadedFiles(@js($statePath))
            },
            uploadUsing: (fileKey, file, success, error, progress) => {
                $wire.upload(
                    \`{{ $statePath }}.\${fileKey}\`,
                    file,
                    () => {
                        success(fileKey)
                    },
                    error,
                    progress
                )
            },
        })
    "
    wire:ignore
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input, {
            ...defaultSettings,
            attributeJsOptions: {
                printWidth: 210,
                semi: false
            }
        }), out);
    });

    test('attribute formatting can be disabled', () => {
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
                $wire.upload(\`{{ $statePath }}.\${fileKey}\`, file, () => {
                    success(fileKey)
                }, error, progress)
            },
        })"
        wire:ignore
    >
</div>
`;
        const expected = `<div
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
                $wire.upload(\`{{ $statePath }}.\${fileKey}\`, file, () => {
                    success(fileKey)
                }, error, progress)
            },
        })"
    wire:ignore
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input, {
            ...defaultSettings,
            formatJsAttributes: false,
        }), expected);
    });

    test('attribute patterns can be excluded', () => {
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
                $wire.upload(\`{{ $statePath }}.\${fileKey}\`, file, () => {
                    success(fileKey)
                }, error, progress)
            },
        })"
        wire:ignore
    >
</div>
`;
        const expected = `<div
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
                $wire.upload(\`{{ $statePath }}.\${fileKey}\`, file, () => {
                    success(fileKey)
                }, error, progress)
            },
        })"
    wire:ignore
></div>
`;
        assert.strictEqual(formatBladeStringWithPint(input, {
            ...defaultSettings,
            formatJsAttributes: true,
            excludeJsAttributes: [
                '^ax-',
                '^x-',
            ]
        }), expected);
    });
});