import * as prettier from 'prettier';
import { BladeDocument } from '../../document/bladeDocument.js';
import { TransformOptions } from '../../document/transformOptions.js';
import { ParserOptions } from '../../parser/parserOptions.js';
import { PhpParserPhpValidator } from '../../parser/php/phpParserPhpValidator.js';
import { FormattingOptions } from '../formattingOptions.js';
import { getEnvSettings, getPrettierFilePath } from '../optionDiscovery.js';
import { PrettierDocumentFormatter } from './prettierDocumentFormatter.js';
import { getHtmlOptions, getOptionsAdjuster, setOptions } from './utils.js';
import { ClassStringEmulation } from '../classStringEmulation.js';
import { AttributeRangeRemover, canProcessAttributes } from '../../document/attributeRangeRemover.js';
import { FragmentsParser } from '../../parser/fragmentsParser.js';
import { IExtractedAttribute } from '../../parser/extractedAttribute.js';
import { ClassStringRuleEngine } from '../classStringsConfig.js';
import { ClassEmulator } from '../../parser/classEmulator.js';
import { BladeComponentNode } from '../../nodes/nodes.js';
import { VoidHtmlTagsManager } from './voidHtmlTagsManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let prettierOptions: prettier.ParserOptions,
    transformOptions: TransformOptions,
    parserOptions: ParserOptions;
let bladeOptions: FormattingOptions | null = null;

interface IAttributeRemovedDocument {
    doc: BladeDocument;
    shadowDocument: BladeDocument,
    attributeMap: Map<string, IExtractedAttribute>,
    canSafelyContinue: boolean,
    originalText: string,
    formattedDocument: string,
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
            parse: async function (text: string, options) {
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

                let parseText = text;

                if (canProcessAttributes) {
                    parseText = VoidHtmlTagsManager.adjustInput(parseText);
                }

                let prettierText = parseText,
                    shadowText = parseText;

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

                    const setupTransformer = classStringEmulation
                        .withParserOptions(parserOptions)
                        .withPhpValidator(phpValidator);
                    prettierText = await setupTransformer.transform(prettierText);

                    shadowText = await classStringEmulation
                        .withParserOptions(parserOptions)
                        .withPhpValidator(phpValidator)
                        .transform(shadowText);

                    if (attributeMap.size > 0) {
                        for (const attribute of attributeMap) {
                            try {
                                const classStringRuleEngine = new ClassStringRuleEngine(classConfig),
                                    jsEmulator = new ClassEmulator(classStringRuleEngine);

                                jsEmulator.setAllowedMethodNames(classConfig.allowedMethodNames);
                                jsEmulator.setExcludedLanguageStructures(classConfig.ignoredLanguageStructures);

                                let transformContent = attribute[1].content.substring(1, attribute[1].content.length - 1),
                                    newTransformContent = await jsEmulator.emulateJavaScriptString(transformContent);

                                if (transformContent === newTransformContent && !jsEmulator.getFoundAnyStrings()) {
                                    attribute[1].content = await jsEmulator.emulateJavaScriptString(attribute[1].content);
                                } else {
                                    attribute[1].content = '"' + transformContent + '"';
                                }
                            } catch (err) {
                                // Handle the error or continue to the next iteration
                            }
                        }

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

                const formatResult: IAttributeRemovedDocument = {
                    doc: document,
                    attributeMap: attributeMap,
                    shadowDocument: shadow,
                    canSafelyContinue: canSafelyContinue,
                    originalText: text,
                    formattedDocument: text,
                };

                const formatter = new PrettierDocumentFormatter(prettierOptions, transformOptions);

                if (!canSafelyContinue) {
                    formatResult.formattedDocument = text;

                    return formatResult;
                }

                var result = await formatter
                    .withRemovedAttributes(attributeMap)
                    .formatDocument(document, shadow);

                const adjustHtmlDoctype = /^(\s*)<!doctype html>/im;

                result = result.replace(adjustHtmlDoctype, '$1<!DOCTYPE html>');

                formatResult.formattedDocument = result;

                return formatResult;
            },
            locStart: () => 0,
            locEnd: () => 0,
            astFormat: "blade",
        },
    },
    printers: {
        blade: {
            print: function (path: prettier.AstPath) {
                const doc = path.stack[0] as IAttributeRemovedDocument;

                return doc.formattedDocument;
            }
        }
    },
    defaultOptions: {
        tabWidth: 4,
    },
};

export default plugin;
