import { StringUtilities } from '../utilities/stringUtilities.js';
import { BladeDocument } from '../document/bladeDocument.js';
import { LiteralNode, SwitchStatementNode, ConditionNode, DirectiveNode, BladeEchoNode, ForElseNode, BladeCommentNode, BladeComponentNode, InlinePhpNode, BladeEscapedEchoNode, BladeEntitiesEchoNode } from '../nodes/nodes.js';
import { ClassEmulator } from '../parser/classEmulator.js';
import { PhpValidator } from '../parser/php/phpValidator.js';
import { ParserOptions, getParserOptions } from '../parser/parserOptions.js';
import { ClassStringRuleEngine, IClassStringConfiguration } from './classStringsConfig.js';
import { TransformIgnore } from '../document/transformIgnore.js';

export class ClassStringEmulation {
    private classStringConfig: IClassStringConfiguration;
    private classRuleEngine: ClassStringRuleEngine;
    private phpValidator: PhpValidator | null = null;
    private parserOptions: ParserOptions;
    private isIgnoring: boolean = false;

    constructor(classStringConfig: IClassStringConfiguration) {
        this.classStringConfig = classStringConfig;
        this.classRuleEngine = new ClassStringRuleEngine(this.classStringConfig);
        this.parserOptions = getParserOptions();
    }

    withPhpValidator(phpValidator: PhpValidator | null) {
        this.phpValidator = phpValidator;

        return this;
    }

    withParserOptions(parserOptions: ParserOptions) {
        this.parserOptions = parserOptions;

        return this;
    }

    private getEmulator(): ClassEmulator {
        const emulator = new ClassEmulator(this.classRuleEngine);

        emulator.setExcludedLanguageStructures(this.classStringConfig.ignoredLanguageStructures);
        emulator.setAllowedMethodNames(this.classStringConfig.allowedMethodNames);

        return emulator;
    }

    async transform(content: string): Promise<string> {
        const document = new BladeDocument();

        document.getParser()
            .withParserOptions(this.parserOptions)
            .withPhpValidator(this.phpValidator);
        document.loadString(content);

        const nodes = document.getAllNodes();

        // If something went horribly wrong while parsing
        // the input document, we will skip class string
        // emulation, as we cannot guarantee anything
        // about the placement of strings inside.
        if (document.getParser().getDidRecovery()) {
            return content;
        }

        let stringResults = '';

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (node instanceof LiteralNode) {
                stringResults += node.content;
            } else if (node instanceof SwitchStatementNode) {
                stringResults += node.nodeContent;
            } else if (node instanceof ConditionNode) {
                stringResults += node.nodeContent;
            } else if (node instanceof DirectiveNode) {
                if (this.isIgnoring ||this.classStringConfig.excludedDirectives.includes(node.directiveName.toLowerCase())) {
                    stringResults += node.sourceContent;

                    if (node.directiveName == 'php') {
                        stringResults += node.documentContent;
                    }
                } else {
                    if (node.directiveName == 'php') {
                        if (node.isClosedBy != null) {
                            if (this.isIgnoring ||!this.classRuleEngine.canTransformBladePhp(node)) {
                                stringResults += node.sourceContent + node.documentContent;
                            } else {
                                if (this.phpValidator?.isValid(node.documentContent, true)) {
                                    const phpEmulate = this.getEmulator();
                                    stringResults += '@php' + await phpEmulate.emulatePhpNode(node.documentContent);
                                } else {
                                    stringResults += node.sourceContent + node.documentContent;
                                }                                
                            }
                        } else {
                            stringResults += node.sourceContent;
                        }
                    } else if (node.directiveName == 'verbatim') {
                        stringResults += node.sourceContent + node.innerContent;
                    } else {
                        if (this.isIgnoring ||node.hasJsonParameters || !this.classRuleEngine.canTransformDirective(node)) {
                            stringResults += node.sourceContent;
                        } else {
                            if (!node.hasDirectiveParameters || !node.hasValidPhp()) {
                                stringResults += node.sourceContent;
                            } else {
                                const dirEmulate = this.getEmulator();
                                stringResults += await dirEmulate.emulateString(node.sourceContent);
                            }

                            if (i + 1 < nodes.length && nodes[i + 1] instanceof LiteralNode) {
                                const literal = nodes[i + 1] as LiteralNode;

                                if (literal.content.length == 0) {
                                    continue;
                                }

                                const firstCh = literal.content[0];

                                if (StringUtilities.ctypePunct(firstCh)) {
                                    continue;
                                }

                                if (!StringUtilities.ctypeSpace(firstCh)) {
                                    stringResults += ' ';
                                }
                            }
                        }
                    }
                }
            } else if (node instanceof BladeEchoNode) {
                if (this.isIgnoring || !this.classRuleEngine.canTransformBladeEcho(node) || !node.hasValidPhp()) {
                    stringResults += node.sourceContent;
                } else {
                    const phpEmulate = this.getEmulator(),
                        echoResults = (await phpEmulate.emulatePhpNode(node.content)).trim();
                    let start = '{{ ',
                        end = ' }}';

                    if (node instanceof BladeEscapedEchoNode) {
                        start = '{!! ';
                        end = ' !!}';
                    } else if (node instanceof BladeEntitiesEchoNode) {
                        start = '{{{ ';
                        end = ' }}}';
                    }

                    stringResults += start + echoResults + end;
                }
            } else if (node instanceof ForElseNode) {
                stringResults += node.nodeContent;
            } else if (node instanceof BladeCommentNode) {
                stringResults += node.sourceContent;

                if (node.innerContent.trim() == TransformIgnore.FormatIgnoreStart) {
                    this.isIgnoring = true;
                } else if (node.innerContent.trim() == TransformIgnore.FormatIgnoreEnd) {
                    this.isIgnoring = false;
                }
            } else if (node instanceof BladeComponentNode) {
                stringResults += node.sourceContent;
            } else if (node instanceof InlinePhpNode) {
                if (this.isIgnoring || !this.classRuleEngine.canTransformInlinePhp(node) || !node.hasValidPhp()) {
                    stringResults += node.sourceContent;
                } else {
                    const phpEmulate = this.getEmulator();
                    stringResults += await phpEmulate.emulatePhpTag(node.sourceContent);
                }
            }
        }

        return stringResults;
    }
}
