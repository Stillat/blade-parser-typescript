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
import { AttributeRangeRemover, canProcessAttributes } from '../../document/attributeRangeRemover';
import { FragmentsParser } from '../../parser/fragmentsParser';
import { IExtractedAttribute } from '../../parser/extractedAttribute';
import { ClassStringRuleEngine } from '../classStringsConfig';
import { ClassEmulator } from '../../parser/classEmulator';
import { BladeComponentNode } from '../../nodes/nodes';

let prettierOptions: prettier.ParserOptions,
    transformOptions: TransformOptions,
    parserOptions: ParserOptions;
let bladeOptions: FormattingOptions | null = null;

interface IAttributeRemovedDocument {
    doc: BladeDocument;
    shadowDocument: BladeDocument,
    attributeMap: Map<string, IExtractedAttribute>,
    canSafelyContinue: boolean,
    originalText: string
}

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

                // TODO: Only produce shadows if we have extracted attributes 🚀
                let prettierText = text,
                    shadowText = text;

                const classConfig = transformOptions.classStrings,
                    phpValidator = new PhpParserPhpValidator();
                let attributeMap: Map<string, IExtractedAttribute> = new Map(),
                    canSafelyContinue = true;

                if (transformOptions.formatJsAttributes && canProcessAttributes) {
                    const fragments = new FragmentsParser(),
                        tmpDoc = BladeDocument.fromText(prettierText);
                    fragments.setIndexRanges(tmpDoc.getParser().getNodeIndexRanges());

                    fragments.setExtractAttributeNames(transformOptions.includeJsAttributes);
                    fragments.setExcludeAttributes(transformOptions.excludeJsAttributes);
                    fragments.setExtractAttributes(true);

                    fragments.parse(prettierText);

                    if (fragments.getParsingTracedStringHitEof()) {
                        canSafelyContinue = false;
                    }

                    if (canSafelyContinue) {
                        const extractedAttributes = fragments.getExtractedAttributes();

                        tmpDoc.getAllNodes().forEach((node) => {
                            if (node instanceof BladeComponentNode && node.hasParameters) {
                                node.parameters.forEach((param) => {
                                    if (param.isEscapedExpression && param.valuePosition != null &&
                                        param.valuePosition.start != null && param.valuePosition.end != null) {

                                        extractedAttributes.push({
                                            content: param.wrappedValue,
                                            name: param.name,
                                            startedOn: param.valuePosition.start.offset,
                                            endedOn: param.valuePosition.end.offset
                                        });
                                    }
                                });
                            }
                        });

                        if (extractedAttributes.length > 0) {
                            const attributeRemover = new AttributeRangeRemover(),
                                remResult = attributeRemover.remove(prettierText, extractedAttributes);

                            attributeMap = attributeRemover.getRemovedAttributes();
                            prettierText = remResult;
                        }
                    }
                }

                if (classConfig.enabled) {
                    const classStringEmulation = new ClassStringEmulation(classConfig);

                    prettierText = classStringEmulation
                        .withParserOptions(parserOptions)
                        .withPhpValidator(phpValidator)
                        .transform(prettierText);

                    shadowText = classStringEmulation
                        .withParserOptions(parserOptions)
                        .withPhpValidator(phpValidator)
                        .transform(shadowText);

                    if (attributeMap.size > 0) {
                        attributeMap.forEach((attribute) => {
                            try {

                                const classStringRuleEngine = new ClassStringRuleEngine(classConfig),
                                    jsEmulator = new ClassEmulator(classStringRuleEngine);

                                jsEmulator.setAllowedMethodNames(classConfig.allowedMethodNames);
                                jsEmulator.setExcludedLanguageStructures(classConfig.ignoredLanguageStructures);

                                let transformContent = attribute.content.substring(1, attribute.content.length - 1),
                                    newTransformContent = jsEmulator.emulateJavaScriptString(transformContent);

                                if (transformContent == newTransformContent && !jsEmulator.getFoundAnyStrings()) {
                                    attribute.content = jsEmulator.emulateJavaScriptString(attribute.content);
                                } else {
                                    attribute.content = '"' + transformContent + '"';
                                }

                            } catch (err) {
                                return;
                            }
                        });
                    }
                }

                const document = new BladeDocument(),
                    shadow = new BladeDocument();

                document.getParser()
                    .withParserOptions(parserOptions)
                    .withPhpValidator(phpValidator);

                // The document "shadow" will contain the
                // structures of the original document,
                // without any modificationns. We will
                // use this later when formatting.
                shadow.getParser()
                    .withParserOptions(parserOptions)
                    .withPhpValidator(phpValidator);

                document.loadString(prettierText);
                shadow.loadString(shadowText);

                const result: IAttributeRemovedDocument = {
                    doc: document,
                    attributeMap: attributeMap,
                    shadowDocument: shadow,
                    canSafelyContinue: canSafelyContinue,
                    originalText: text
                };

                return result;
            },
            locStart: () => 0,
            locEnd: () => 0,
            astFormat: "blade",
        },
    },
    printers: {
        blade: {
            print(path: prettier.AstPath) {
                const doc = path.stack[0] as IAttributeRemovedDocument,
                    formatter = new PrettierDocumentFormatter(prettierOptions, transformOptions);

                if (!doc.canSafelyContinue) {
                    return doc.originalText;
                }

                return formatter
                    .withRemovedAttributes(doc.attributeMap)
                    .formatDocument(doc.doc, doc.shadowDocument);
            }
        }
    },
    defaultOptions: {
        tabWidth: 4,
    },
};

export = plugin;
