import { StringRemover } from '../parser/stringRemover';
import { formatAsHtml } from './prettier/utils';
import { StringUtilities } from '../utilities/stringUtilities';
import { BladeDocument } from '../document/bladeDocument';
import { LiteralNode, SwitchStatementNode, ConditionNode, DirectiveNode, BladeEchoNode, ForElseNode, BladeCommentNode, BladeComponentNode, InlinePhpNode, BladePhpNode } from '../nodes/nodes';
import { ClassEmulator } from '../parser/classEmulator';
import { PhpValidator } from '../parser/php/phpValidator';
import { ParserOptions, getParserOptions } from '../parser/parserOptions';

export class ClassStringEmulation {
    private ignoreDirectives: string[] = ['if', 'unless', 'elseif'];
    private phpValidator: PhpValidator | null = null;
    private parserOptions: ParserOptions;

    constructor() {
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

    transform(content: string): string {
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
                if (this.ignoreDirectives.includes(node.directiveName)) {
                    stringResults += node.sourceContent;
                } else {
                    if (node.directiveName == 'php') {
                        if (node.isClosedBy != null) {
                            // TODO: Configurable.
                            if (!node.hasValidPhp()) {
                                stringResults += node.sourceContent + node.documentContent;
                            } else {
                                const phpEmulate = new ClassEmulator();
                                stringResults += '@php' + phpEmulate.emulatePhpNode(node.documentContent);
                            }
                        } else {
                            stringResults += node.sourceContent;
                        }
                    } else if (node.directiveName == 'verbatim') {
                        stringResults += node.sourceContent + node.innerContent;
                    } else {
                        const dirEmulate = new ClassEmulator();
                        stringResults += dirEmulate.emulateString(node.sourceContent);

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
            } else if (node instanceof BladeEchoNode) {
                stringResults += node.sourceContent;
            } else if (node instanceof ForElseNode) {
                stringResults += node.nodeContent;
            } else if (node instanceof BladeCommentNode) {
                stringResults += node.sourceContent;
            } else if (node instanceof BladeComponentNode) {
                stringResults += node.sourceContent;
            } else if (node instanceof InlinePhpNode) {
                if (!node.hasValidPhp()) {
                    stringResults += node.sourceContent;
                } else {
                    // TODO: Configurable.
                    const phpEmulate = new ClassEmulator();
                    // stringResults += phpEmulate.emulatePhpTag(node.sourceContent);
                    stringResults += phpEmulate.emulatePhpTag(node.sourceContent);
                }
            } else {
                debugger;
            }
        }

        return stringResults;
    }
}
