import * as prettier from 'prettier';
import { BladeDocument } from '../../document/bladeDocument';
import { TransformOptions } from '../../document/transformOptions';
import { ParserOptions } from '../../parser/parserOptions';
import { PhpParserPhpValidator } from '../../parser/php/phpParserPhpValidator';
import { FormattingOptions } from '../formattingOptions';
import { getEnvSettings } from '../optionDiscovery';
import { PrettierDocumentFormatter } from './prettierDocumentFormatter';
import { getHtmlOptions, setOptions } from './utils';

let prettierOptions: prettier.ParserOptions,
    transformOptions:TransformOptions,
    parserOptions:ParserOptions;
let bladeOptions: FormattingOptions | null = null;

const plugin: prettier.Plugin = {
    languages: [
        {
            name: "Blade",
            parsers: ["blade"],
            extensions: [".blade.php"],
            vscodeLanguageIds: ["blade"],
        }
    ],
    parsers: {
        blade: {
            parse: function (text: string, _, options) {
                setOptions(options);
                prettierOptions = options;

                bladeOptions = getEnvSettings(__dirname);
                transformOptions = bladeOptions as TransformOptions;
                parserOptions = bladeOptions as ParserOptions;
                transformOptions.tabSize = getHtmlOptions().tabWidth;

                const document = new BladeDocument();
                document.getParser()
                    .withParserOptions(parserOptions)
                    .withPhpValidator(new PhpParserPhpValidator());

                return document.loadString(text);
            },
            locStart: () => 0,
            locEnd: () => 0,
            astFormat: "blade",
        },
    },
    printers: {
        blade: {
            print(path: prettier.AstPath) {
                const doc = path.stack[0] as BladeDocument;

                return (new PrettierDocumentFormatter(prettierOptions, transformOptions)).formatDocument(doc);
            }
        }
    },
    defaultOptions: {
        tabWidth: 4,
    },
};

export = plugin;
