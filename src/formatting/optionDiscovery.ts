import * as fs from 'fs';
import * as path from 'path';
import { CommonEventShortcuts } from '../parser/excludeDirectives/commonEventShortcuts';
import { CssAtRules } from '../parser/excludeDirectives/cssAtRules';
import { FormattingOptions } from './formattingOptions';

const BLADE_CONFIG_FILE = '.blade.format.json';

const defaultSettings: FormattingOptions = {
    ignoreDirectives: [
        ...CssAtRules,
        ...CommonEventShortcuts
    ],
    spacesAfterDirective: 0,
    spacesAfterControlDirective: 1,
    tabSize: 4,
    formatDirectiveJsonParameters: true,
    formatDirectivePhpParameters: true,
    formatInsideEcho: true,
    customIfs: [],
    directives: [],
    echoStyle: 'block',
    useLaravelPint: false,
    pintCommand: '',
    phpOptions: {
        phpVersion: '8.0'
    },
    pintCacheDirectory: '',
    pintTempDirectory: '',
    pintCacheEnabled: true,
    pintConfigPath: '',
};

export { defaultSettings };

let overrideOptions: FormattingOptions | null,
    overrideFilePath: string | null;

export function setEnvSettings(options: FormattingOptions | null) {
    overrideOptions = options;
}

export function setPrettierFilePath(path: string | null) {
    overrideFilePath = path;
}

export function getPrettierFilePath(): string | null {
    return overrideFilePath;
}

export function getEnvSettings(startingDirectory: string): FormattingOptions {
    if (overrideOptions != null) {
        return overrideOptions;
    }

    const settingsFile = findSettingsFile(startingDirectory);

    if (settingsFile == null) {
        return defaultSettings;
    }

    if (fs.existsSync(settingsFile) == false) {
        return defaultSettings;
    }

    const optionContents = fs.readFileSync(settingsFile, { encoding: 'utf8' });

    try {
        const parsedFile = JSON.parse(optionContents) as any,
            bladeFormattingConfig = parseBladeConfigObject(parsedFile);

        if (bladeFormattingConfig.useLaravelPint) {
            if (bladeFormattingConfig.pintCommand.length == 0) {
                const vendorPath = settingsFile.substring(0, settingsFile.length - BLADE_CONFIG_FILE.length) + '/vendor/bin/pint';

                if (fs.existsSync(vendorPath)) {
                    bladeFormattingConfig.pintCommand = `php ${vendorPath} {file}`;
                }
            }

            if (bladeFormattingConfig.pintTempDirectory.trim().length == 0) {
                bladeFormattingConfig.pintTempDirectory = __dirname + '/_temp/';
            }

            if (bladeFormattingConfig.pintCacheDirectory.trim().length == 0) {
                bladeFormattingConfig.pintCacheDirectory = __dirname + '/_cache/';
            }

            if (bladeFormattingConfig.pintTempDirectory.trim().length > 0) {
                bladeFormattingConfig.pintTempDirectory = normalizeFilePath(bladeFormattingConfig.pintTempDirectory.trim());
            }

            if (bladeFormattingConfig.pintCacheDirectory.trim().length > 0) {
                bladeFormattingConfig.pintCacheDirectory = normalizeFilePath(bladeFormattingConfig.pintCacheDirectory.trim());
            }

            if (bladeFormattingConfig.pintConfigPath.trim().length > 0) {
                bladeFormattingConfig.pintConfigPath = normalizeFilePath(bladeFormattingConfig.pintConfigPath.trim());
            } else {
                const pintConfigPath = settingsFile.substring(0, settingsFile.length - BLADE_CONFIG_FILE.length) + '/pint.json';

                if (fs.existsSync(pintConfigPath)) {
                    bladeFormattingConfig.pintConfigPath = pintConfigPath;
                }
            }
        }

        return bladeFormattingConfig;
    } catch (err) {
        console.log(err);
    }

    return defaultSettings;
}

export function parseBladeConfigObject(configObject: any): FormattingOptions {
    let ignoreDirectives: string[] = CssAtRules,
        spacesAfterDirective = 0,
        spacesAfterControlDirective = 1,
        tabSize = 4,
        formatDirectivePhpParameters = true,
        formatDirectiveJsonParameters = true,
        formatInsideEcho = true,
        customIfs: string[] = [],
        directives: string[] = [],
        phpOptions: any | null = null,
        echoStyle: string = 'block',
        useLaravelPint = false,
        pintCommand = '',
        pintTempDir = '',
        pintCacheDir = '',
        pintCacheEnabled = true,
        pintConfigPath = '';

    if (typeof configObject.ignoreDirectives !== 'undefined' && configObject.ignoreDirectives !== null) {
        ignoreDirectives = configObject.ignoreDirectives as string[];
    }

    if (typeof configObject.spacesAfterDirective !== 'undefined' && configObject.spacesAfterDirective !== null) {
        spacesAfterDirective = configObject.spacesAfterDirective as number;
    }

    if (typeof configObject.spacesAfterControlDirective !== 'undefined' && configObject.spacesAfterControlDirective !== null) {
        spacesAfterControlDirective = configObject.spacesAfterControlDirective as number;
    }

    if (typeof configObject.tabSize !== 'undefined' && configObject.tabSize !== null) {
        tabSize = configObject.tabSize as number;
    }

    if (typeof configObject.formatDirectivePhpParameters !== 'undefined' && configObject.formatDirectivePhpParameters !== null) {
        formatDirectivePhpParameters = configObject.formatDirectivePhpParameters as boolean;
    }

    if (typeof configObject.formatDirectiveJsonParameters !== 'undefined' && configObject.formatDirectiveJsonParameters !== null) {
        formatDirectiveJsonParameters = configObject.formatDirectiveJsonParameters as boolean;
    }

    if (typeof configObject.customIfs !== 'undefined' && configObject.customIfs !== null) {
        customIfs = configObject.customIfs as string[];
    }

    if (typeof configObject.useLaravelPint !== 'undefined' && configObject.useLaravelPint !== null) {
        useLaravelPint = configObject.useLaravelPint as boolean;
    }

    if (typeof configObject.directives !== 'undefined' && configObject.directives !== null) {
        directives = configObject.directives as string[];
    }

    if (typeof configObject.echoStyle !== 'undefined' && configObject.echoStyle === 'inline') {
        echoStyle = 'inline';
    }

    if (typeof configObject.formatInsideEcho !== 'undefined' && configObject.formatInsideEcho !== null) {
        formatInsideEcho = configObject.formatInsideEcho as boolean;
    }

    if (typeof configObject.phpOptions !== 'undefined') {
        phpOptions = configObject.phpOptions;
    }

    if (typeof configObject.pintCommand !== 'undefined') {
        pintCommand = (configObject.pintCommand as string).trim();
    }

    if (typeof configObject.pintConfig !== 'undefined') {
        pintConfigPath = (configObject.pintConfig as string).trim();
    }

    if (typeof configObject.pintTempDirectory !== 'undefined') {
        pintTempDir = (configObject.pintTempDirectory as string).trim();
    }

    if (typeof configObject.pintCacheDirectory !== 'undefined') {
        pintCacheDir = (configObject.pintCacheDirectory as string).trim();
    }

    if (typeof configObject.pintCacheEnabled !== 'undefined') {
        pintCacheEnabled = configObject.pintCacheEnabled as boolean;
    }

    if (spacesAfterDirective < 0) {
        spacesAfterDirective = 0;
    }

    if (spacesAfterControlDirective < 0) {
        spacesAfterControlDirective = 1;
    }

    if (spacesAfterDirective > 3) {
        spacesAfterDirective = 3;
    }

    if (spacesAfterControlDirective > 3) {
        spacesAfterControlDirective = 3;
    }

    return {
        ignoreDirectives: ignoreDirectives,
        spacesAfterDirective: spacesAfterDirective,
        spacesAfterControlDirective: spacesAfterControlDirective,
        tabSize: tabSize,
        formatDirectivePhpParameters: formatDirectivePhpParameters,
        formatDirectiveJsonParameters: formatDirectiveJsonParameters,
        formatInsideEcho: formatInsideEcho,
        customIfs: customIfs,
        directives: directives,
        phpOptions: phpOptions,
        echoStyle: echoStyle,
        useLaravelPint: useLaravelPint,
        pintCommand: pintCommand,
        pintCacheDirectory: pintCacheDir,
        pintTempDirectory: pintTempDir,
        pintCacheEnabled: pintCacheEnabled,
        pintConfigPath: pintConfigPath
    };
}

function normalizeFilePath(filePath: string): string {
    const separatorPattern = /[\\/]+/g;
    let normalizedPath = filePath.replace(separatorPattern, '/');

    if (!normalizedPath.endsWith('/')) {
        normalizedPath += '/';
    }

    return normalizedPath;
}

function findSettingsFile(startingDirectory: string): string | null {
    let searchPath = path.dirname(startingDirectory);

    if (searchPath == '.') {
        searchPath = process.cwd();
    }

    const parts = searchPath.split(path.sep);

    while (parts.length > 0) {
        const newPath = parts.join(path.sep),
            formatFileCandidate = path.join(newPath, BLADE_CONFIG_FILE);

        if (fs.existsSync(formatFileCandidate)) {
            return formatFileCandidate;
        }

        parts.pop();
    }

    return null;
}