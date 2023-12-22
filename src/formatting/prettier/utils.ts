import prettier, { ParserOptions } from "prettier";
import plugin from './plugin.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import php from "@prettier/plugin-php/standalone";
import * as jsonata from "@stedi/prettier-plugin-jsonata";
import { FormattingOptions } from '../formattingOptions.js';
import { defaultSettings, setEnvSettings } from '../optionDiscovery.js';
import { TransformOptions } from '../../document/transformOptions.js';
import { isAttributeFormatter } from '../../document/attributeRangeRemover.js';
import { StringRemover } from '../../parser/stringRemover.js';
import { StringUtilities } from '../../utilities/stringUtilities.js';
import { Transformer } from '../../document/transformer.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let phpOptions: ParserOptions,
    htmlOptions: ParserOptions,
    echoPhpOptions: ParserOptions,
    originalOptions: ParserOptions,
    additionalHtmlPlugins: any[] = [];

export function getEchoPhpOptions() {
    return echoPhpOptions;
}

export function getPhpOptions() {
    return phpOptions;
}

export function getOriginalOptions() {
    return originalOptions;
}

export function addHtmlPlugin(plugin: any) {
    additionalHtmlPlugins.push(plugin);
}

export function clearAdditionalHtmlPlugins() {
    additionalHtmlPlugins = [];
}

export function cleanOptions(options: ParserOptions): ParserOptions {
    [
        "cursorOffset",
        "rangeEnd",
        "rangeStart",
        "locEnd",
        "locStat",
        "printer",
        "originalText",
        "astFormat",
    ].forEach((p) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete options[p];
    });

    return options;
}

export function getHtmlOptions(): ParserOptions {
    return htmlOptions as ParserOptions;
}

export async function formatJson(text: string) {
    return await prettier.format(text, {
        parser: 'JSONata',
        plugins: [jsonata as any],
        printWidth: 20,
    });
}

export async function formatBladeString(text: string, options: FormattingOptions | null = null, prettierOptions: ParserOptions | null = null): Promise<string> {
    // Override settings and disable automatic option discovery. Useful for testing.
    setEnvSettings(options);

    if (prettierOptions == null) {
        return await prettier.format(text, {
            parser: 'blade',
            plugins: [plugin as any as string],
        });
    }

    return await prettier.format(text, {
        ...prettierOptions,
        parser: 'blade',
        plugins: [plugin as any as string],
    });
}

export async function formatBladeStringWithPint(text: string, options: FormattingOptions | null = null, transformOptions: TransformOptions | null = null, prettierOptions: ParserOptions | null = null): Promise<string> {
    let pintLocation = __dirname + '/../../../pint/pint',
        pintConfig = __dirname + '/../../../pint/pint.json',
        pintCacheDirectory = __dirname + '/../../../_test/_cache/',
        pintTempDirectory = __dirname + '/../../../_test/_temp/',
        pintCommand = `php ${pintLocation} {file}`;

    if (transformOptions != null) {
        pintCommand = transformOptions.pintCommand;
        pintCacheDirectory = transformOptions.pintCacheDirectory;
        pintTempDirectory = transformOptions.pintTempDirectory;
        pintConfig = transformOptions.pintConfigPath;
    }

    let curOptions: FormattingOptions = {
        ...defaultSettings,
        useLaravelPint: true,
        pintCommand: pintCommand,
        pintCacheDirectory: pintCacheDirectory,
        pintTempDirectory: pintTempDirectory,
        pintConfigPath: pintConfig
    };

    if (options != null) {
        curOptions = {
            ...curOptions,
            ...options,
            useLaravelPint: true,
            pintCommand: pintCommand,
            pintCacheDirectory: pintCacheDirectory,
            pintTempDirectory: pintTempDirectory,
            pintConfigPath: pintConfig
        };
    }

    return await formatBladeString(text, curOptions, prettierOptions);
}

type PrettierOptionsAdjuster = (options: ParserOptions) => ParserOptions;

let optionsAdjuster: PrettierOptionsAdjuster | null = null;

export function setOptionsAdjuster(adjuster: PrettierOptionsAdjuster | null) {
    optionsAdjuster = adjuster;
}

export function getOptionsAdjuster(): PrettierOptionsAdjuster | null {
    return optionsAdjuster;
}

export function setOptions(options: ParserOptions) {
    originalOptions = options;

    htmlOptions = cleanOptions(
        Object.assign({}, options,
            { htmlWhitespaceSensitivity: "ignore", parser: "html", plugins: options.plugins }
        )
    );

    phpOptions = cleanOptions(
        Object.assign({}, options, {
            parser: 'php',
            plugins: [php],
        })
    );

    echoPhpOptions = cleanOptions(
        Object.assign({}, options, {
            parser: 'php',
            plugins: [php],
            printWidth: Infinity,
        })
    );
}

export async function formatAsJavaScript(text: string, transformOptions: TransformOptions): Promise<string> {
    if (transformOptions.attributeJsOptions != null) {
        return await prettier.format(text, {
            ...htmlOptions,
            ...transformOptions.attributeJsOptions,
            parser: 'babel',
            singleQuote: true,
            trailingComma: 'es5',
            quoteProps: 'preserve'
        });
    }

    return await prettier.format(text, {
        ...htmlOptions,
        parser: 'babel',
        printWidth: 80,
        singleQuote: true,
        quoteProps: 'preserve',
        semi: false,
        trailingComma: 'all',
    });
}

function getPrettierPlugins() {
    let plugins: any[] = [];

    if (htmlOptions.plugins) {
        plugins = htmlOptions.plugins;
    }

    if (additionalHtmlPlugins) {
        additionalHtmlPlugins.forEach((plugin) => {
            plugins.push(plugin);
        });
    }

    return plugins;
}

export async function formatAsHtml(text: string): Promise<string> {
    if (isAttributeFormatter) {
        let formatText = text,
            removedStringMap: string[] = [];

        try {
            const strRemover = new StringRemover(),
                repMap: Map<string, string> = new Map();

            strRemover.remove(text);

            removedStringMap = strRemover.getStrings().reverse();

            removedStringMap.forEach((string, index) => {
                const rep = StringUtilities.makeSlug(128);
                repMap.set(rep, string);

                formatText = formatText.replace(`"${string}"`, `"${rep}"`);
            });

            let fResult = await prettier.format(formatText, {
                ...htmlOptions,
                plugins: getPrettierPlugins(),
                printWidth: 20,
                singleQuote: true,
                singleAttributePerLine: true,
                parser: 'html'
            });

            // Make value-less attributes nicer.
            const formattedLines: string[] = StringUtilities.breakByNewLine(fResult),
                newLines: string[] = [];

            for (let i = 0; i < formattedLines.length; i++) {
                const line = formattedLines[i];

                if (Transformer.inlineComments.includes(line.trim())) {
                    if (newLines.length > 0) {
                        newLines[newLines.length - 1] = newLines[newLines.length - 1] + ' ' + line.trim();
                        continue;
                    } else {
                        newLines.push(line);
                    }
                }

                if (line.includes('<')) {
                    newLines.push(line);
                } else if (line.trim().includes(' ')) {
                    const parts = line.split(' '),
                        leadingWs = line.length - line.trimLeft().length;

                    parts.forEach((part) => {
                        if (part.trim().length == 0) {
                            return;
                        }

                        newLines.push(' '.repeat(leadingWs) + part);
                    });
                } else {
                    newLines.push(line);
                }
            }

            fResult = newLines.join("\n");

            repMap.forEach((string, rep) => {
                fResult = fResult.replace(rep, string);
            });

            return fResult;
        } catch (err) {
            return text;
        }
    }



    return await prettier.format(text, {
        ...htmlOptions,
        plugins: getPrettierPlugins(),
        singleQuote: true,
        parser: 'html'
    });
}

export async function formatAsHtmlStrings(text: string): Promise<string> {
    return await prettier.format(text, {
        ...htmlOptions,
        plugins: getPrettierPlugins(),
        proseWrap: 'never',
        singleQuote: true,
        parser: 'html'
    });
}

function resolvePhpOptions(defaultOptions: ParserOptions, transformOptions: TransformOptions, options: ParserOptions | null = null) {
    let opts = defaultOptions;

    if (options != null) {
        opts = options;
    }

    if (typeof transformOptions.phpOptions !== 'undefined' && transformOptions.phpOptions != null) {
        let phpOpts = transformOptions.phpOptions;

        opts = {
            ...opts,
            ...phpOpts
        } as ParserOptions;
    } else {
        opts = {
            ...opts,
            "phpVersion": "8.0"
        } as ParserOptions;
    }

    return opts;
}

export async function inlineFormatPhp(text: string, transformOptions: TransformOptions, options: ParserOptions | null = null) {
    const opts = resolvePhpOptions(echoPhpOptions, transformOptions, options);

    let result = (await prettier.format(text, opts)).trim();

    result = result.substring(5);

    if (text.endsWith(';') == false && result.endsWith(';')) {
        result = result.substring(0, result.length - 1);
    }

    return result.trim();
}

export async function formatPhp(text: string, transformOptions: TransformOptions, options: ParserOptions | null = null) {
    const opts = resolvePhpOptions(phpOptions, transformOptions, options);
    let result = (await prettier.format(text, opts)).trim();

    result = result.substring(5);

    if (text.endsWith(';') == false && result.endsWith(';')) {
        result = result.substring(0, result.length - 1);
    }

    return result.trim();
}

export async function formatTagPhp(text: string, transformOptions: TransformOptions, options: ParserOptions | null = null) {
    const opts = resolvePhpOptions(phpOptions, transformOptions, options);
    const result = (await prettier.format(text, opts)).trim();

    return result.trim();
}