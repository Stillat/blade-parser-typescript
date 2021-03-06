import prettier, { ParserOptions } from "prettier";
import * as plugin from './plugin';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import php from "@prettier/plugin-php/standalone";
import { formatJsonata } from "@stedi/prettier-plugin-jsonata/dist/lib";

let phpOptions: ParserOptions,
    htmlOptions: ParserOptions;

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

export function formatBladeString(text: string) {
    return prettier.format(text, {
        parser: 'blade',
        plugins: [plugin as any as string]
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
            plugins: [php]
        })
    );
}


export function formatAsHtml(text: string) {
    return prettier.format(text, htmlOptions);
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