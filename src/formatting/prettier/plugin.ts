import * as prettier from 'prettier';
import { BladeDocument } from '../../document/bladeDocument';
import { TransformOptions } from '../../document/transformOptions';
import { ParserOptions } from '../../parser/parserOptions';
import { PhpParserPhpValidator } from '../../parser/php/phpParserPhpValidator';
import { FormattingOptions } from '../formattingOptions';
import { getEnvSettings, getPrettierFilePath } from '../optionDiscovery';
import { PrettierDocumentFormatter } from './prettierDocumentFormatter';
import { getHtmlOptions, getOptionsAdjuster, setOptions } from './utils';
import { ClassStringEmulation } from '../classStringEmulation';
import { AttributeRangeRemover } from '../../document/attributeRangeRemover';
import { FragmentsParser } from '../../parser/fragmentsParser';
import { IBladeDocumentWithRemovedAttributes } from '../../document/bladeDocumentWithRemovedAttributes';
import { IExtractedAttribute } from '../../parser/extractedAttribute';

let prettierOptions: prettier.ParserOptions,
    transformOptions: TransformOptions,
    parserOptions: ParserOptions;
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
                const overridePath = getPrettierFilePath(),
                    adjuster = getOptionsAdjuster();

                if (adjuster != null) {
                    options = adjuster(options);
                }

                // Provides a way to override this setting.
                if (overridePath != null) {
                    options.filepath = overridePath;
                }

                setOptions(options);
                prettierOptions = options;

                bladeOptions = getEnvSettings(__dirname);
                transformOptions = bladeOptions as TransformOptions;
                parserOptions = bladeOptions as ParserOptions;
                transformOptions.tabSize = getHtmlOptions().tabWidth;

                let prettierText = text;

                const classConfig = transformOptions.classStrings,
                    phpValidator = new PhpParserPhpValidator();

                const fragments = new FragmentsParser(),
                    tmpDoc = BladeDocument.fromText(prettierText);
                fragments.setIndexRanges(tmpDoc.getParser().getNodeIndexRanges());

                fragments.setExtractAttributeNames(['x-data', 'ax-load', 'ax-load-src']);
                fragments.setExtractAttributes(true);

                fragments.parse(prettierText);
                const extractedAttributes = fragments.getExtractedAttributes();

                let attributeMap:Map<string, IExtractedAttribute> = new Map();

                if (extractedAttributes.length > 0) {
                    const attributeRemover = new AttributeRangeRemover();
                    prettierText = attributeRemover.remove(prettierText, extractedAttributes);
                    attributeMap = attributeRemover.getRemovedAttributes();
                }

                if (classConfig.enabled) {
                    const classStringEmulation = new ClassStringEmulation(classConfig);

                    prettierText = classStringEmulation
                        .withParserOptions(parserOptions)
                        .withPhpValidator(phpValidator)
                        .transform(prettierText);
                }

                const document = new BladeDocument();
                document.getParser()
                    .withParserOptions(parserOptions)
                    .withPhpValidator(phpValidator);

                document.loadString(prettierText);

                const docToFormat:IBladeDocumentWithRemovedAttributes = {
                    doc: document,
                    attributes: attributeMap
                };

                return docToFormat;
            },
            locStart: () => 0,
            locEnd: () => 0,
            astFormat: "blade",
        },
    },
    printers: {
        blade: {
            print(path: prettier.AstPath) {
                const doc = path.stack[0] as IBladeDocumentWithRemovedAttributes,
                    formatter = new PrettierDocumentFormatter(prettierOptions, transformOptions);

                return formatter
                    .withExtractedAttributes(doc.attributes)
                    .formatDocument(doc.doc);
            }
        }
    },
    defaultOptions: {
        tabWidth: 4,
    },
};

export = plugin;
