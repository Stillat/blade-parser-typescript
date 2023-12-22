import { CssAtRules } from './excludeDirectives/cssAtRules.js';
import { CommonEventShortcuts } from './excludeDirectives/commonEventShortcuts.js';

export interface ParserOptions {
    ignoreDirectives: string[],
    directives: string[],
    customIfs: string[],
}

let globalOptions: ParserOptions = {
    ignoreDirectives: [
        ...CssAtRules,
        ...CommonEventShortcuts
    ],
    directives: [],
    customIfs: []
};

export function updateParserOptions(options: ParserOptions) {
    globalOptions = options;
}

export function getParserOptions(): ParserOptions {
    return globalOptions;
}