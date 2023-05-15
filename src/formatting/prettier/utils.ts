import prettier, { ParserOptions } from "prettier";
import * as plugin from './plugin';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import php from "@prettier/plugin-php/standalone";
import { formatJsonata } from "@stedi/prettier-plugin-jsonata/dist/lib";
import { FormattingOptions } from '../formattingOptions';
import { setEnvSettings } from '../optionDiscovery';

let phpOptions: ParserOptions,
    htmlOptions: ParserOptions,
    echoPhpOptions: ParserOptions;

export function getEchoPhpOptions() {
    return echoPhpOptions;
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
    // Override settings and disable automtic option discovery. Useful for testing.
    setEnvSettings(options);

    return prettier.format(text, {
        parser: 'blade',
        plugins: [plugin as any as string],
    });
}

export function setOptions(options: ParserOptions) {
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
    return prettier.format(text, htmlOptions);
}

export function inlineFormatPhp(text: string, options: ParserOptions | null = null) {
    let opts = echoPhpOptions;

    if (options != null) {
        opts = options;
    }

    let result = prettier.format(text, opts).trim();

    result = result.substring(5);

    if (text.endsWith(';') == false && result.endsWith(';')) {
        result = result.substring(0, result.length - 1);
    }

    return result.trim();
}

export function formatPhp(text: string) {
    let result = prettier.format(text, phpOptions).trim();

    result = result.substring(5);

    if (text.endsWith(';') == false && result.endsWith(';')) {
        result = result.substring(0, result.length - 1);
    }

    return result.trim();
}

export function formatTagPhp(text: string) {
    const result = prettier.format(text, phpOptions).trim();

    return result.trim();
}