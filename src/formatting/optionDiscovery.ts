import * as fs from 'fs';
import * as path from 'path';
import { CommonEventShortcuts } from '../parser/excludeDirectives/commonEventShortcuts';
import { CssAtRules } from '../parser/excludeDirectives/cssAtRules';
import { FormattingOptions } from './formattingOptions';

const BLADE_CONFIG_FILE = '.blade.format.json';

const defaultSettings:FormattingOptions = {
    ignoreDirectives: [
        ...CssAtRules,
        ...CommonEventShortcuts
    ],
    spacesAfterDirective: 0,
    tabSize: 4,
    formatDirectiveJsonParameters: true,
    formatDirectivePhpParameters: true,
    customIfs: [],
    directives: []
};

export function getEnvSettings(startingDirectory: string): FormattingOptions {
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

        let ignoreDirectives:string[] = CssAtRules,
            spacesAfterDirective = 0,
            tabSize = 4,
            formatDirectivePhpParameters = true,
            formatDirectiveJsonParameters = true,
            customIfs:string[] = [],
            directives:string[] = [];
        
        if (typeof parsedFile.ignoreDirectives !== 'undefined' && parsedFile.ignoreDirectives !== null) {
            ignoreDirectives = parsedFile.ignoreDirectives as string[];
        }

        if (typeof parsedFile.spacesAfterDirective !== 'undefined' && parsedFile.spacesAfterDirective !== null) {
            spacesAfterDirective = parsedFile.spacesAfterDirective as number;
        }

        if (typeof parsedFile.tabSize !== 'undefined' && parsedFile.tabSize !== null) {
            tabSize = parsedFile.tabSize as number;
        }

        if (typeof parsedFile.formatDirectivePhpParameters !== 'undefined' && parsedFile.formatDirectivePhpParameters !== null) {
            formatDirectivePhpParameters = parsedFile.formatDirectivePhpParameters as boolean;
        }

        if (typeof parsedFile.formatDirectiveJsonParameters !== 'undefined' && parsedFile.formatDirectiveJsonParameters !== null) {
            formatDirectiveJsonParameters = parsedFile.formatDirectiveJsonParameters as boolean;
        }

        if (typeof parsedFile.customIfs !== 'undefined' && parsedFile.customIfs !== null) {
            customIfs = parsedFile.customIfs as string[];
        }

        if (typeof parsedFile.directives !== 'undefined' && parsedFile.directives !== null) {
            directives = parsedFile.directives as string[];
        }

        return {
            ignoreDirectives: ignoreDirectives,
            spacesAfterDirective: spacesAfterDirective,
            tabSize: tabSize,
            formatDirectivePhpParameters: formatDirectivePhpParameters,
            formatDirectiveJsonParameters: formatDirectiveJsonParameters,
            customIfs: customIfs,
            directives: directives
        };
    } catch (err) {
        console.log(err);
    }

    return defaultSettings;
}

function findSettingsFile(startingDirectory:string): string | null {
    let searchPath = path.dirname(startingDirectory);

    if (searchPath == '.') {
        searchPath = process.cwd();
    }

    const parts  = searchPath.split(path.sep);

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