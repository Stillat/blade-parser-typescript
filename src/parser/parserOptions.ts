import { CssAtRules } from './cssAtRules';

export interface ParserOptions {
    ignoreDirectives: string[],
    directives: string[],
    customIfs: string[],
}

let globalOptions: ParserOptions = {
    ignoreDirectives: [
        ...CssAtRules
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