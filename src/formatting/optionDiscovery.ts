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
};

export {defaultSettings};

let overrideOptions: FormattingOptions | null;

export function setEnvSettings(options:FormattingOptions | null) {
    overrideOptions = options;
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
        const parsedFile = JSON.parse(optionContents) as any;

        return parseBladeConfigObject(parsedFile);
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
        phpOptions:any|null = null,
        echoStyle: string = 'block',
        useLaravelPint = false;

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
        useLaravelPint: useLaravelPint
    };
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