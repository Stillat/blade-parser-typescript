import prettier, { ParserOptions } from "prettier";
import * as plugin from './plugin';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import php from "@prettier/plugin-php/standalone";
import { formatJsonata } from "@stedi/prettier-plugin-jsonata/dist/lib";
import { FormattingOptions } from '../formattingOptions';
import { defaultSettings, setEnvSettings } from '../optionDiscovery';
import { TransformOptions } from '../../document/transformOptions';

let phpOptions: ParserOptions,
    htmlOptions: ParserOptions,
    echoPhpOptions: ParserOptions,
    originalOptions: ParserOptions;

export function getEchoPhpOptions() {
    return echoPhpOptions;
}

export function getPhpOptions() {
    return phpOptions;
}

export function getOriginalOptions() {
    return originalOptions;
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

export function formatJson(text: string) {
    return formatJsonata(text, {
        printWidth: 20
    });
}

export function formatBladeString(text: string, options: FormattingOptions | null = null) {
    // Override settings and disable automatic option discovery. Useful for testing.
    setEnvSettings(options);

    return prettier.format(text, {
        parser: 'blade',
        plugins: [plugin as any as string],
    });
}

export function formatBladeStringWithPint(text: string, options: FormattingOptions | null = null, transformOptions: TransformOptions | null = null) {
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

    return formatBladeString(text, curOptions);
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


export function formatAsHtml(text: string) {
    return prettier.format(text, {
        ...htmlOptions,
        parser: 'html'
    });
}

export function formatAsHtmlStrings(text: string) {
    return prettier.format(text, {
        ...htmlOptions,
        proseWrap: 'never',
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

export function inlineFormatPhp(text: string, transformOptions: TransformOptions, options: ParserOptions | null = null) {
    const opts = resolvePhpOptions(echoPhpOptions, transformOptions, options);

    let result = prettier.format(text, opts).trim();

    result = result.substring(5);

    if (text.endsWith(';') == false && result.endsWith(';')) {
        result = result.substring(0, result.length - 1);
    }

    return result.trim();
}

export function formatPhp(text: string, transformOptions: TransformOptions, options: ParserOptions | null = null) {
    const opts = resolvePhpOptions(phpOptions, transformOptions, options);
    let result = prettier.format(text, opts).trim();

    result = result.substring(5);

    if (text.endsWith(';') == false && result.endsWith(';')) {
        result = result.substring(0, result.length - 1);
    }

    return result.trim();
}

export function formatTagPhp(text: string, transformOptions: TransformOptions, options: ParserOptions | null = null) {
    const opts = resolvePhpOptions(phpOptions, transformOptions, options);
    const result = prettier.format(text, opts).trim();

    return result.trim();
}