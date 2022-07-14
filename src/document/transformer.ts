import { AbstractNode, BladeCommentNode, BladeComponentNode, BladeEchoNode, ConditionNode, DirectiveNode, ExecutionBranchNode, ForElseNode, FragmentPosition, InlinePhpNode, LiteralNode, ParameterNode, ParameterType, SwitchCaseNode, SwitchStatementNode } from '../nodes/nodes';
import { SimpleArrayParser } from '../parser/simpleArrayParser';
import { StringUtilities } from '../utilities/stringUtilities';
import { BladeDocument } from './bladeDocument';
import { ArrayPrinter } from './printers/arrayPrinter';
import { CommentPrinter } from './printers/commentPrinter';
import { DirectivePrinter } from './printers/directivePrinter';
import { EchoPrinter } from './printers/echoPrinter';
import { IndentLevel } from './printers/indentLevel';
import { TransformOptions } from './transformOptions';

export type PhpFormatter = (input: string) => string;
export type BlockPhpFormatter = (input: string) => string;
export type PhpTagFormatter = (input: string) => string;
export type JsonFormatter = (input: string) => string;

interface EmbeddedDocument {
    slug: string,
    content: string,
    isScript: boolean
}

interface TransformedPairedDirective {
    innerDoc: string,
    slug: string,
    directive: DirectiveNode,
    virtualElementSlug: string,
    isInline: boolean
}

interface TransformedForElse {
    truthDoc: string,
    falseDoc: string,
    forElse: ForElseNode,
    truthClose: string,
    emptyOpen: string,
    pairClose: string,
    truthSlug: string,
    falseSlug: string
}

interface TransformedLogicBranch {
    branch: ExecutionBranchNode,
    slug: string,
    doc: string,
    pairOpen: string,
    pairClose: string,
    isFirst: boolean,
    isLast: boolean,
    virtualOpen: string,
    virtualClose: string,
    virtualBreakOpen: string,
    virtualBreakClose: string
}

interface TransformedCondition {
    condition: ConditionNode,
    structures: TransformedLogicBranch[],
    pairOpen: string,
    pairClose: string
}

interface TransformedCase {
    case: SwitchCaseNode,
    slug: string,
    doc: string,
    pairOpen: string,
    pairClose: string,
    virtualOpen: string,
    virtualClose: string,
    leadingOpen: string,
    leadingClose: string,
    isFirst: boolean,
    isLast: boolean
}

interface TransformedSwitch {
    switchNode: SwitchStatementNode,
    structures: TransformedCase[],
    pairOpen: string,
    pairClose: string,
    virtualSwitchOpen: string,
    virtualSwitchClose: string
}

interface VirtualBlockStructure {
    node: AbstractNode,
    pairOpen: string,
    pairClose: string,
    virtualElement: string
}

export class Transformer {
    private doc: BladeDocument;
    private inlineDirectiveBlocks: Map<string, DirectiveNode> = new Map();
    private contentDirectives: Map<string, DirectiveNode> = new Map();
    private dynamicEchoBlocks: Map<string, BladeEchoNode> = new Map();
    private pairedDirectives: Map<string, TransformedPairedDirective> = new Map();
    private dynamicInlineDirectives: Map<string, string> = new Map();
    private inlineDirectives: Map<string, TransformedPairedDirective> = new Map();
    private inlineEchos: Map<string, BladeEchoNode> = new Map();
    private spanEchos: Map<string, BladeEchoNode> = new Map();
    private inlinePhpNodes: Map<string, InlinePhpNode> = new Map();
    private echoBlockSlugs: Map<string, string> = new Map();
    private parentTransformer: Transformer | null = null;
    private forElseWithEmpty: TransformedForElse[] = [];
    private forElseNoEmpty: TransformedForElse[] = [];
    private conditions: TransformedCondition[] = [];
    private switchStatements: TransformedSwitch[] = [];
    private removeLines: string[] = [];
    private virtualStructureOpens: string[] = [];
    private virtualStructureClose: string[] = [];
    private inlineComments: Map<string, BladeCommentNode> = new Map();
    private blockComments: VirtualBlockStructure[] = [];
    private blockPhpNodes: Map<string, InlinePhpNode> = new Map();
    private breakDirectives: Map<string, DirectiveNode> = new Map();
    private dynamicElementDirectives: Map<string, string> = new Map();
    private dynamicElementDirectiveNodes: Map<string, DirectiveNode> = new Map();
    private dynamicElementConditions: Map<string, string> = new Map();
    private dynamicElementConditionNodes: Map<string, ConditionNode> = new Map();
    private dynamicElementSwitch: Map<string, string> = new Map();
    private dynamicElementSwitchNodes: Map<string, SwitchStatementNode> = new Map();
    private dynamicElementForElse: Map<string, string> = new Map();
    private dynamicElementForElseNodes: Map<string, ForElseNode> = new Map();
    private dynamicElementPhpNodes: Map<string, InlinePhpNode> = new Map();
    private dynamicElementPhp: Map<string, string> = new Map();
    private embeddedEchos: Map<string, BladeEchoNode> = new Map();
    private embeddedDirectives: Map<string, DirectiveNode> = new Map();
    private structureLines: string[] = [];
    private directiveParameters: Map<string, ParameterNode> = new Map();
    private expressionParameters: Map<string, ParameterNode> = new Map();
    private slugs: string[] = [];
    private extractedEmbeddedDocuments: Map<string, EmbeddedDocument> = new Map();
    private propDirectives: Map<string, DirectiveNode> = new Map();

    private phpFormatter: PhpFormatter | null = null;
    private blockPhpFormatter: BlockPhpFormatter | null = null;
    private phpTagFormatter: BlockPhpFormatter | null = null;
    private jsonFormatter: JsonFormatter | null = null;

    private transformOptions: TransformOptions = {
        spacesAfterDirective: 0,
        tabSize: 4,
        formatDirectiveJsonParameters: true,
        formatDirectivePhpParameters: true
    }

    constructor(doc: BladeDocument) {
        this.doc = doc;
    }

    setParentTransformer(transformer: Transformer) {
        this.parentTransformer = transformer;

        return this;
    }

    withJsonFormatter(formatter: JsonFormatter) {
        this.jsonFormatter = formatter;

        return this;
    }

    withBlockPhpFormatter(formatter: BlockPhpFormatter) {
        this.blockPhpFormatter = formatter;

        return this;
    }

    withPhpTagFormatter(formatter: PhpTagFormatter) {
        this.phpTagFormatter = formatter;

        return this;
    }

    withPhpFormatter(formatter: PhpFormatter) {
        this.phpFormatter = formatter;

        return this;
    }

    /**
     * Returns a document with Blade removed.
     * @returns string
     */
    removeBlade(): string {
        const allNodes = this.doc.getAllNodes();
        let text = '';

        allNodes.forEach((node) => {
            if (node instanceof LiteralNode) {
                text += node.getOutputContent();
            } else if (node instanceof InlinePhpNode) {
                text += node.sourceContent;
            } else if (node instanceof DirectiveNode && node.directiveName == 'verbatim') {
                text += node.innerContent;
            }
        });

        return text;
    }

    private close(value: string): string {
        return '</' + value + '>';
    }

    private open(value: string): string {
        return '<' + value + '>';
    }

    private selfClosing(value: string): string {
        return '<' + value + ' />';
    }

    private pair(value: string, innerContent = ''): string {
        return '<' + value + '>' + innerContent + '</' + value + '>';
    }

    private printDirective(directive: DirectiveNode): string {
        return DirectivePrinter.printDirective(
            directive,
            this.transformOptions,
            this.phpFormatter,
            this.jsonFormatter
        );
    }

    private makeSlug(length: number): string {
        if (length <= 2) {
            length = 7;
        }

        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            charactersLength = characters.length;

        for (let i = 0; i < length - 1; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }

        const slug = 'B' + result + 'B';

        if (this.slugs.includes(slug)) {
            return this.makeSlug(length + 1);
        }

        this.slugs.push(slug);

        return slug;
    }

    private registerDirectiveParameter(slug: string, param: ParameterNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerDirectiveParameter(slug, param);
        } else {
            this.directiveParameters.set(slug, param);
        }
    }

    private registerExpressionParameter(slug: string, param: ParameterNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerExpressionParameter(slug, param);
        } else {
            this.expressionParameters.set(slug, param);
        }
    }

    private registerCondition(transformedCondition: TransformedCondition) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerCondition(transformedCondition);
        } else {
            this.conditions.push(transformedCondition);
        }
    }

    private registerSwitchStatement(transformedSwitch: TransformedSwitch) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerSwitchStatement(transformedSwitch);
        } else {
            this.switchStatements.push(transformedSwitch);
        }
    }

    private registerPairedDirective(slug: string, directive: TransformedPairedDirective) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerPairedDirective(slug, directive);
        } else {
            if (directive.isInline == false) {
                this.pairedDirectives.set(slug, directive);
            } else {
                this.inlineDirectives.set(directive.slug, directive);
                this.dynamicInlineDirectives.set(directive.directive.nodeContent, directive.slug);
            }
        }
    }

    private registerInlineDirectiveBlock(slug: string, directive: DirectiveNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerInlineDirectiveBlock(slug, directive);
        } else {
            this.inlineDirectiveBlocks.set(slug, directive);
        }
    }

    private registerContentDirective(slug: string, directive: DirectiveNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerContentDirective(slug, directive);
        } else {
            this.contentDirectives.set(slug, directive);
        }
    }

    private registerComment(slug: string, comment: BladeCommentNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerComment(slug, comment);
        } else {
            this.inlineComments.set(slug, comment);
        }
    }

    private registerDynamicDirective(slug: string, directive: DirectiveNode) {
        if (this.parentTransformer != null) {
            this.dynamicElementDirectives.set(directive.nodeContent, slug);
            this.parentTransformer.registerDynamicDirective(slug, directive);
        } else {
            this.dynamicElementDirectives.set(directive.nodeContent, slug);
            this.dynamicElementDirectiveNodes.set(slug, directive);
        }
    }

    private prepareConditionalDirective(directive: DirectiveNode): string {
        if (this.dynamicElementDirectives.has(directive.nodeContent)) {
            return this.dynamicElementDirectives.get(directive.nodeContent) as string;
        }

        const slug = this.makeSlug(directive.nodeContent.length);

        this.registerDynamicDirective(slug, directive);

        return slug;
    }

    private prepareInlineBlockDirective(directive: DirectiveNode): string {
        const slug = this.makeSlug(directive.sourceContent.length);

        this.registerInlineDirectiveBlock(slug, directive);

        return this.selfClosing(slug);
    }

    private prepareContentDirective(directive: DirectiveNode): string {
        const slug = this.makeSlug(directive.sourceContent.length);

        this.registerContentDirective(slug, directive);

        return slug;
    }

    private registerPhpBlock(slug: string, php: InlinePhpNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerPhpBlock(slug, php);
        } else {
            this.removeLines.push(this.close(slug));

            this.blockPhpNodes.set(slug, php);
        }
    }

    private registerConditionalPhpBlock(slug: string, php: InlinePhpNode) {
        if (this.parentTransformer != null) {
            this.dynamicElementPhp.set(php.sourceContent, slug);
            this.parentTransformer.registerConditionalPhpBlock(slug, php);
        } else {
            this.dynamicElementPhp.set(php.sourceContent, slug);
            this.dynamicElementPhpNodes.set(slug, php);
        }
    }

    private prepareConditionalPhpBlock(php: InlinePhpNode): string {
        if (this.dynamicElementPhp.has(php.sourceContent)) {
            return this.dynamicElementPhp.get(php.sourceContent) as string;
        }

        const slug = this.makeSlug(php.sourceContent.length);

        this.registerConditionalPhpBlock(slug, php);

        return slug;
    }

    private registerInlinePhpBlock(php: InlinePhpNode): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerInlinePhpBlock(php);
        } else {
            const slug = this.makeSlug(php.sourceContent.length);

            this.inlinePhpNodes.set(slug, php);

            return slug;
        }
    }

    private prepareInlinePhpBlock(php: InlinePhpNode): string {
        return this.registerInlinePhpBlock(php);
    }

    private preparePhpBlock(php: InlinePhpNode): string {
        if (php.fragmentPosition == FragmentPosition.IsDynamicFragmentName) {
            return this.prepareConditionalPhpBlock(php);
        }

        if (php.isInline) {
            return this.prepareInlinePhpBlock(php);
        }

        const slug = this.makeSlug(35);

        this.registerPhpBlock(slug, php);

        const open = this.open(slug),
            close = this.close(slug);

        return "\n" + open + close + "\n";
    }

    private transformPhpBlock(content: string): string {
        let value = content;

        this.blockPhpNodes.forEach((php, slug) => {
            const open = this.open(slug),
                targetIndent = this.indentLevel(open);

            let result = php.sourceContent;

            if (this.phpTagFormatter != null && php.hasValidPhp()) {
                result = this.phpTagFormatter(result);

                result = IndentLevel.shiftIndent(
                    result,
                    targetIndent,
                    true
                );
            }

            value = value.replace(open, result);
        });

        this.dynamicElementPhpNodes.forEach((php, slug) => {
            value = StringUtilities.replaceAllInString(value, slug, this.printInlinePhp(php));
        });

        this.inlinePhpNodes.forEach((php, slug) => {
            value = value.replace(slug, this.printInlinePhp(php));
        });

        return value;
    }

    private printInlinePhp(php: InlinePhpNode): string {
        let phpContent = php.sourceContent;

        if (this.phpTagFormatter && php.hasValidPhp()) {
            phpContent = this.phpTagFormatter(phpContent);

            phpContent = StringUtilities.replaceAllInString(phpContent, "\n", ' ');
        }

        return phpContent;
    }

    private preparePairedDirective(directive: DirectiveNode): string {
        const slug = this.makeSlug(directive.sourceContent.length),
            directiveName = directive.directiveName.toLowerCase(),
            innerDoc = directive.childrenDocument?.document.transform().setParentTransformer(this).toStructure() as string;

        if (directive.fragmentPosition != FragmentPosition.IsDynamicFragmentName) {
            let virtualSlug = '';
            let result = `${this.open(slug)}\n`;
            if (directiveName == 'php' || directiveName == 'verbatim') {
                virtualSlug = this.makeSlug(15);
                result += this.pair(virtualSlug);
            } else {
                if (directive.containsChildStructures == false && directive.containsAnyFragments == false) {
                    virtualSlug = this.makeSlug(15);
                    result += this.pair(virtualSlug, innerDoc);
                } else {
                    result += innerDoc;
                }
            }
            result += `${this.close(slug)}\n`;

            this.virtualStructureOpens.push(this.open(virtualSlug));
            this.virtualStructureClose.push(this.close(virtualSlug));
            this.virtualStructureClose.push(this.close(slug));

            this.registerPairedDirective(slug, {
                innerDoc: innerDoc,
                slug: slug,
                directive: directive,
                virtualElementSlug: virtualSlug,
                isInline: false
            });

            return result;
        }

        if (this.dynamicInlineDirectives.has(directive.nodeContent)) {
            const existingSlug = this.dynamicInlineDirectives.get(directive.nodeContent) as string;

            return existingSlug + ' ';
        }

        const dynamicSlug = this.makeSlug(directive.nodeContent.length);

        this.registerPairedDirective(slug, {
            innerDoc: innerDoc,
            slug: dynamicSlug,
            directive: directive,
            virtualElementSlug: '',
            isInline: true
        });

        return dynamicSlug + ' ';
    }

    private registerForElseWithEmpty(forElse: TransformedForElse) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerForElseWithEmpty(forElse);
        } else {
            this.forElseWithEmpty.push(forElse);
        }
    }

    private prepareForElse(forElse: ForElseNode): string {
        if (forElse.fragmentPosition == FragmentPosition.Unresolved || forElse.fragmentPosition == FragmentPosition.InsideFragment) {

            if (forElse.elseNode != null) {
                const truthSlug = this.makeSlug(forElse.constructedFrom?.sourceContent.length ?? 0),
                    elseSlug = this.makeSlug(forElse.elseNode?.sourceContent.length ?? 0),
                    truthTransform = forElse.truthDocument?.document.transform().setParentTransformer(this).toStructure() as string,
                    falseTransform = forElse.falseDocument?.document.transform().setParentTransformer(this).toStructure() as string;

                const repForElse: TransformedForElse = {
                    truthDoc: truthTransform,
                    falseDoc: falseTransform,
                    forElse: forElse,
                    truthClose: this.close(truthSlug),
                    emptyOpen: this.open(elseSlug),
                    pairClose: this.close(elseSlug),
                    truthSlug: truthSlug,
                    falseSlug: elseSlug
                };

                let result = this.open(truthSlug);
                result += truthTransform;
                result += repForElse.truthClose;

                result += "\n" + repForElse.emptyOpen + "\n"; // This replacement will be the @empty
                result += falseTransform + "";
                result += repForElse.pairClose;

                this.registerForElseWithEmpty(repForElse);

                return result;
            }

            const construction = forElse.constructedFrom as DirectiveNode,
                truthDoc = forElse.truthDocument?.document.transform().setParentTransformer(this).toStructure() as string,
                openSlug = this.makeSlug(construction.sourceContent.length),
                closeSlug = this.makeSlug(construction.isClosedBy?.sourceContent.length ?? 0);

            const noElseForElse: TransformedForElse = {
                truthDoc: truthDoc,
                falseDoc: '',
                forElse: forElse,
                truthSlug: openSlug,
                falseSlug: '',
                pairClose: this.close(closeSlug),
                emptyOpen: '',
                truthClose: ''
            };

            this.forElseNoEmpty.push(noElseForElse);

            let result = this.open(openSlug);

            result += truthDoc;
            result += this.close(openSlug);

            return result;
        }

        if (this.dynamicElementForElse.has(forElse.nodeContent)) {
            const existingSlug = this.dynamicElementForElse.get(forElse.nodeContent) as string;

            return existingSlug + ' ';
        }

        const slug = this.makeSlug(forElse.nodeContent.length);

        this.registerDynamicElementForElse(slug, forElse);
        return slug + ' ';
    }

    private registerBreak(slug: string, directive: DirectiveNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerBreak(slug, directive);
        } else {
            this.breakDirectives.set(slug, directive);
        }
    }

    private registerProps(slug: string, directive: DirectiveNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerProps(slug, directive);
        } else {
            this.propDirectives.set(slug, directive);
        }
    }

    private preparePropsDirective(directive: DirectiveNode): string {
        const virtualSlug = this.makeSlug(10);

        this.registerProps(virtualSlug, directive);

        return `\n\n${this.pair(virtualSlug)}`;
    }

    private prepareBreakDirective(directive: DirectiveNode): string {
        const virtualSlug = this.makeSlug(10);

        this.registerBreak(virtualSlug, directive);

        return `\n\n${this.pair(virtualSlug)}`;
    }

    private registerEmbeddedDirective(directive: DirectiveNode): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerEmbeddedDirective(directive);
        }

        const slug = this.makeSlug(directive.nodeContent.length);

        this.embeddedDirectives.set(slug, directive);

        return slug;
    }

    private registerEmbeddedDocument(slug: string, content: string, isScript: boolean): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerEmbeddedDocument(slug, content, isScript);
        }

        this.extractedEmbeddedDocuments.set(slug, {
            slug: slug,
            content: content,
            isScript: isScript
        });

        return slug;
    }

    private prepareDirective(directive: DirectiveNode): string {
        if (directive.isEmbedded()) {
            return this.registerEmbeddedDirective(directive);
        }

        if (directive.directiveName.trim().toLowerCase() == 'break') {
            return this.prepareBreakDirective(directive);
        }

        if (directive.directiveName.trim().toLowerCase() == 'props') {
            return this.preparePropsDirective(directive);
        }

        if (directive.isClosedBy != null) {
            return this.preparePairedDirective(directive);
        }
        if (directive.fragmentPosition == FragmentPosition.Unresolved) {
            return this.prepareInlineBlockDirective(directive);
        } else if (directive.fragmentPosition == FragmentPosition.IsDynamicFragmentName) {
            return this.prepareConditionalDirective(directive);
        }

        return this.prepareContentDirective(directive);
    }

    private registerVirtualComment(structure: VirtualBlockStructure) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerVirtualComment(structure);
        } else {
            this.blockComments.push(structure);
        }
    }

    private prepareComment(comment: BladeCommentNode): string {
        if (comment.isMultiline()) {
            const slug = this.makeSlug(10),
                virtualSlug = this.makeSlug(10);
            const virtualStructure: VirtualBlockStructure = {
                node: comment,
                pairOpen: this.open(slug),
                pairClose: this.close(slug),
                virtualElement: this.selfClosing(virtualSlug)
            };

            this.registerVirtualComment(virtualStructure);

            return virtualStructure.pairOpen + "\n" + virtualStructure.virtualElement + "\n" + virtualStructure.pairClose;
        }

        const slug = this.makeSlug(comment.sourceContent.length);

        this.registerComment(slug, comment);

        return this.selfClosing(slug);
    }

    private registerDynamicFragmentEcho(echo: BladeEchoNode): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerDynamicFragmentEcho(echo);
        } else {
            if (!this.echoBlockSlugs.has(echo.sourceContent)) {
                const slug = this.makeSlug(echo.sourceContent.length);
                this.dynamicEchoBlocks.set(slug, echo);
                this.echoBlockSlugs.set(echo.sourceContent, slug);

                return slug;
            } else {
                return this.echoBlockSlugs.get(echo.sourceContent) as string;
            }
        }
    }

    private registerInlineEcho(echo: BladeEchoNode): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerInlineEcho(echo);
        } else {
            const slug = this.makeSlug(echo.sourceContent.length);

            if (echo.isInlineEcho) {
                this.spanEchos.set(slug, echo);

                return slug;
            } else {
                this.inlineEchos.set(slug, echo);

                return this.selfClosing(slug);
            }
        }
    }

    private prepareComponent(component: BladeComponentNode): string {
        if (component.isClosingTag) {
            if (component.name?.name == 'slot') {
                return '</x-slot>';
            }

            return '</x-' + component.getComponentName() + '>';
        }

        let value = '<x-';

        if (component.name?.name == 'slot' && component.isSelfClosing == false) {
            if (component.name.inlineName.trim().length > 0) {
                let slotName = component.name.inlineName;

                if (slotName.startsWith(':')) {
                    slotName = slotName.substring(1);
                }

                value += 'slot name="' + slotName + '"';
            } else {
                value += component.getComponentName();
            }
        } else {
            value += component.getComponentName();
        }

        if (component.hasParameters) {
            value += ' ';

            component.parameters.forEach((param) => {
                if (param.type == ParameterType.Parameter) {
                    if (param.isExpression) {
                        const expressionSlug = this.makeSlug(param.content.length);
                        this.registerExpressionParameter(expressionSlug, param);
                        value += expressionSlug + ' ';
                    } else {
                        value += param.content + ' ';
                    }
                } else if (param.type == ParameterType.Attribute) {
                    value += param.name + ' ';
                } else if (param.type == ParameterType.Directive) {
                    const directiveSlug = this.makeSlug(param.directive?.sourceContent.length ?? 0);
                    this.registerDirectiveParameter(directiveSlug, param);
                    value += directiveSlug + ' ';
                }
            });
        }

        if (component.isSelfClosing) {
            value += ' />';
        } else {
            value += '>';
        }

        return value;
    }

    private registerEmbeddedEcho(echo: BladeEchoNode): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerEmbeddedEcho(echo);
        }

        const slug = this.makeSlug(echo.sourceContent.length);

        this.embeddedEchos.set(slug, echo);

        return slug;
    }

    private prepareEcho(echo: BladeEchoNode): string {
        if (echo.isEmbedded()) {
            return this.registerEmbeddedEcho(echo);
        }

        if (echo.fragmentPosition == FragmentPosition.IsDynamicFragmentName) {
            return this.registerDynamicFragmentEcho(echo);
        } else if (echo.fragmentPosition == FragmentPosition.InsideFragment || echo.fragmentPosition == FragmentPosition.InsideFragmentParameter) {
            return this.registerDynamicFragmentEcho(echo);
        }

        return this.registerInlineEcho(echo);
    }

    private prepareSwitch(switchNode: SwitchStatementNode): string {
        if (switchNode.fragmentPosition == FragmentPosition.Unresolved || switchNode.fragmentPosition == FragmentPosition.InsideFragment) {
            const tCases: TransformedCase[] = [];
            let result = '';

            switchNode.cases.forEach((caseNode, index) => {
                const directive = caseNode.head as DirectiveNode,
                    innerDoc = caseNode.childDocument?.document.transform().setParentTransformer(this).toStructure() as string;
                const openSlug = this.makeSlug(directive.sourceContent.length);

                const virtualOpen = this.makeSlug(5);

                const tCase: TransformedCase = {
                    case: caseNode,
                    slug: openSlug,
                    doc: innerDoc,
                    virtualOpen: this.selfClosing(virtualOpen),
                    virtualClose: this.close(virtualOpen),
                    pairOpen: this.open(openSlug),
                    pairClose: this.close(openSlug),
                    isFirst: index == 0,
                    isLast: index == switchNode.cases.length - 1,
                    leadingClose: '',
                    leadingOpen: ''
                };

                if (caseNode.leadingDocument != null) {
                    const leadingSlug = this.makeSlug(25);

                    tCase.leadingOpen = this.open(leadingSlug);
                    tCase.leadingClose = this.close(leadingSlug);

                    result += "\n" + caseNode.leadingDocument.document.transform().setParentTransformer(this).toStructure() + "\n";
                }

                result += tCase.pairOpen;
                if (caseNode.head?.directiveName == 'default') {
                    result += tCase.virtualOpen;
                }
                result += innerDoc;
                result += tCase.pairClose;

                tCases.push(tCase);
            });

            const pairOpen = tCases[0].pairOpen as string,
                pairClose = tCases[tCases.length - 1].pairClose as string;
            const virtualSwitchSlug = this.makeSlug(10),
                virtualSwitchOpen = this.open(virtualSwitchSlug),
                virtualSwitchClose = this.close(virtualSwitchSlug);
            const tSwitch: TransformedSwitch = {
                switchNode: switchNode,
                pairOpen: pairOpen,
                pairClose: pairClose,
                structures: tCases,
                virtualSwitchClose: virtualSwitchClose,
                virtualSwitchOpen: virtualSwitchOpen
            };

            const virtualStruct = "\n" + virtualSwitchOpen + "\n" + result + "\n" + virtualSwitchClose;

            this.registerSwitchStatement(tSwitch);

            return virtualStruct;
        }

        if (this.dynamicElementSwitch.has(switchNode.nodeContent)) {
            const existingSlug = this.dynamicElementSwitch.get(switchNode.nodeContent) as string;

            return existingSlug + ' ';
        }
        const slug = this.makeSlug(switchNode.nodeContent.length);

        this.registerDynamicElementSwitch(slug, switchNode);

        return slug + ' ';
    }

    private registerDynamicElementSwitch(slug: string, switchNode: SwitchStatementNode) {
        if (this.parentTransformer != null) {
            this.dynamicElementSwitch.set(switchNode.nodeContent, slug);
            this.parentTransformer.registerDynamicElementSwitch(slug, switchNode);
        } else {
            this.dynamicElementSwitch.set(switchNode.nodeContent, slug);
            this.dynamicElementSwitchNodes.set(slug, switchNode);
        }
    }

    private registerDynamicElementCondition(slug: string, condition: ConditionNode) {
        if (this.parentTransformer != null) {
            this.dynamicElementConditions.set(condition.nodeContent, slug);
            this.parentTransformer.registerDynamicElementCondition(slug, condition);
        } else {
            this.dynamicElementConditions.set(condition.nodeContent, slug);
            this.dynamicElementConditionNodes.set(slug, condition);
        }
    }

    private registerDynamicElementForElse(slug: string, forElse: ForElseNode) {
        if (this.parentTransformer != null) {
            this.dynamicElementForElse.set(forElse.nodeContent, slug);
            this.parentTransformer.registerDynamicElementForElse(slug, forElse);
        } else {
            this.dynamicElementForElse.set(forElse.nodeContent, slug);
            this.dynamicElementForElseNodes.set(slug, forElse);
        }
    }

    private prepareConditions(condition: ConditionNode): string {
        if (condition.fragmentPosition == FragmentPosition.Unresolved || condition.fragmentPosition == FragmentPosition.InsideFragment) {
            if (condition.chain.length == 1 && condition.constructedFrom != null) {
                const construction = (condition.constructedFrom as DirectiveNode).clone();

                construction.childrenDocument = condition.logicBranches[0].childDocument;

                return this.preparePairedDirective(construction);
            }

            const transformedBranches: TransformedLogicBranch[] = [];
            let result = '';

            condition.logicBranches.forEach((branch, index) => {
                const directive = branch.head as DirectiveNode,
                    innerDoc = branch.childDocument?.document.transform().setParentTransformer(this).toStructure() as string;
                const openSlug = this.makeSlug(directive.sourceContent.length),
                    virtualSlug = this.makeSlug(10);

                const tBranch: TransformedLogicBranch = {
                    branch: branch,
                    slug: openSlug,
                    doc: innerDoc,
                    pairOpen: this.open(openSlug),
                    pairClose: this.close(openSlug),
                    virtualOpen: this.open(virtualSlug),
                    virtualClose: this.close(virtualSlug),
                    isFirst: index == 0,
                    isLast: index == condition.logicBranches.length - 1,
                    virtualBreakClose: '',
                    virtualBreakOpen: ''
                };

                if (branch.head?.directiveName == 'else') {
                    result += "\n" + tBranch.pairOpen;
                    const virtualBreakSlug = this.makeSlug(25);

                    if (branch.head.containsChildStructures == false && branch.head.containsAnyFragments == false) {
                        tBranch.virtualBreakOpen = this.open(virtualBreakSlug);
                        tBranch.virtualBreakClose = this.close(virtualBreakSlug);
                        result += tBranch.virtualBreakOpen + "\n";
                        result += innerDoc;
                        result += "\n" + tBranch.virtualBreakClose + "\n" + tBranch.pairClose;
                    } else {
                        tBranch.virtualBreakOpen = this.selfClosing(virtualBreakSlug);
                        result += tBranch.virtualBreakOpen + "\n";
                        result += innerDoc;
                        result += "\n" + tBranch.pairClose;
                    }
                } else {

                    if (branch.head?.containsAnyFragments == false && branch.head?.containsChildStructures == false) {
                        const ifBreakSlug = this.makeSlug(25);

                        tBranch.virtualBreakOpen = this.open(ifBreakSlug);
                        tBranch.virtualBreakClose = this.close(ifBreakSlug);


                        result += tBranch.pairOpen;
                        result += "\n" + tBranch.virtualBreakOpen;
                        result += innerDoc;
                        result += "\n" + tBranch.virtualBreakClose;
                        result += tBranch.pairClose;
                    } else {
                        result += tBranch.pairOpen;
                        result += "\n";
                        result += innerDoc;
                        result += "\n";
                        result += tBranch.pairClose;
                    }
                }

                transformedBranches.push(tBranch);
            });

            const pairOpen = transformedBranches[0].pairOpen as string,
                pairClose = transformedBranches[transformedBranches.length - 1].pairClose as string;

            const tCond: TransformedCondition = {
                pairOpen: pairOpen,
                pairClose: pairClose,
                structures: transformedBranches,
                condition: condition
            };

            this.registerCondition(tCond);

            return result;
        }

        if (this.dynamicElementConditions.has(condition.nodeContent)) {
            const existingSlug = this.dynamicElementConditions.get(condition.nodeContent) as string;

            return existingSlug + ' ';
        }
        const slug = this.makeSlug(condition.nodeContent.length);

        this.registerDynamicElementCondition(slug, condition);
        return slug + ' ';
    }

    toStructure(): string {
        let result = '';

        this.doc.getRenderNodes().forEach((node) => {
            if (node instanceof LiteralNode) {
                result += node.content;
            } else if (node instanceof SwitchStatementNode) {
                if (node.cases.length > 0) {
                    result += this.prepareSwitch(node);
                } else {
                    result += this.preparePairedDirective(node.constructedFrom as DirectiveNode);
                }
            } else if (node instanceof ConditionNode) {
                result += this.prepareConditions(node);
            } else if (node instanceof DirectiveNode) {
                result += this.prepareDirective(node);
            } else if (node instanceof BladeEchoNode) {
                result += this.prepareEcho(node);
            } else if (node instanceof ForElseNode) {
                result += this.prepareForElse(node);
            } else if (node instanceof BladeCommentNode) {
                result += this.prepareComment(node);
            } else if (node instanceof BladeComponentNode) {
                result += this.prepareComponent(node);
            } else if (node instanceof InlinePhpNode) {
                result += this.preparePhpBlock(node);
            }
        });

        const structures = this.doc.getParser().getFragmentsContainingStructures();

        if (structures.length > 0) {
            const referenceDocument = BladeDocument.fromText(result);

            structures.forEach((pair) => {
                const ref = this.doc.getParser().getText((pair.start.endPosition?.offset ?? 0) + 1, pair.end.startPosition?.offset ?? 0),
                    refOpen = referenceDocument.getParser().getFragmentsParser().getEmbeddedFragment(pair.start.embeddedIndex),
                    refClose = referenceDocument.getParser().getFragmentsParser().getClosingFragmentAfter(refOpen),
                    curRef = referenceDocument.getParser().getText((refOpen.endPosition?.offset ?? 0) + 1, refClose?.startPosition?.offset ?? 0),
                    refSlug = this.makeSlug(16),
                    isScript = pair.start.name.toLowerCase() == 'script';

                let replaceSlug = refSlug;

                if (isScript) {
                    replaceSlug = '//' + refSlug;
                } else {
                    replaceSlug = '/*' + refSlug + '*/';
                }

                result = result.replace(curRef, replaceSlug);

                this.registerEmbeddedDocument(refSlug, ref, isScript);
            });
        }

        return result;
    }

    withOptions(options: TransformOptions) {
        this.transformOptions = options;

        return this;
    }

    private transformInlineDirectives(content: string): string {
        let value = content;
        this.inlineDirectiveBlocks.forEach((directive, slug) => {
            const search = this.selfClosing(slug),
                replace = this.printDirective(directive);

            value = value.replace(search, replace);
        });

        return value;
    }

    private transformContentDirectives(content: string): string {
        let value = content;

        this.contentDirectives.forEach((directive: DirectiveNode, slug: string) => {
            value = value.replace(slug, this.printDirective(directive));
        });

        return value;
    }

    private transformDynamicEcho(content: string): string {
        let value = content;
        this.dynamicEchoBlocks.forEach((echo: BladeEchoNode, slug: string) => {
            const echoContent = EchoPrinter.printEcho(echo, this.phpFormatter);

            value = StringUtilities.replaceAllInString(value, slug, echoContent);
        });

        return value;
    }

    private transformDynamicDirectives(content: string): string {
        let value = content;

        this.dynamicElementDirectiveNodes.forEach((directive, slug) => {
            const directiveContent = this.printDirective(directive);

            value = StringUtilities.replaceAllInString(value, slug, directiveContent);
        });

        return value;
    }

    private transformBlockPhp(content: string, withNewLine: boolean): string {
        if (this.blockPhpFormatter == null) { return content; }
        let value = content.trim();

        if (value.startsWith('<?php') == false) {
            value = '<?php ' + value;
        }

        value = this.blockPhpFormatter(value);

        if (withNewLine) {
            value = "\n" + value + "\n";
        }

        return value;
    }

    private transformPairedDirectives(content: string): string {
        let value = content;

        this.pairedDirectives.forEach((directive: TransformedPairedDirective, slug: string) => {
            const originalDirective = directive.directive;

            if (directive.virtualElementSlug.length > 0) {
                const open = this.open(directive.virtualElementSlug),
                    close = this.close(directive.virtualElementSlug);
                this.virtualStructureOpens.push(open);
                this.removeLines.push(open);
                this.removeLines.push(close);
            }

            const open = this.open(slug),
                close = this.close(slug);

            if (originalDirective.directiveName.trim().toLowerCase() == 'php') {
                const virtualOpen = this.open(directive.virtualElementSlug),
                    targetIndent = this.indentLevel(virtualOpen),
                    replacePhp = directive.directive.sourceContent;

                const formattedPhp = IndentLevel.shiftIndent(
                    this.transformBlockPhp(originalDirective.innerContent, true),
                    targetIndent,
                    true
                );

                value = value.replace(open, replacePhp);
                value = value.replace(virtualOpen, formattedPhp);
            } else if (originalDirective.directiveName.trim().toLowerCase() == 'verbatim') {
                const replaceVerbatim = directive.directive.sourceContent + "\n" + IndentLevel.shiftClean(
                    originalDirective.innerContent, this.transformOptions.tabSize
                );
                value = value.replace(open, replaceVerbatim);
            } else {
                value = value.replace(open, this.printDirective(directive.directive));
            }

            value = value.replace(close, directive.directive.isClosedBy?.sourceContent as string);
        });

        this.inlineDirectives.forEach((directive, slug) => {
            value = StringUtilities.replaceAllInString(value, slug, directive.directive.nodeContent);
        });

        return value;
    }

    private transformForElseWithNoEmpty(content: string): string {
        let value = content;

        this.forElseNoEmpty.forEach((forElse: TransformedForElse) => {
            const construction = forElse.forElse.constructedFrom as DirectiveNode,
                open = this.open(forElse.truthSlug),
                close = this.close(forElse.truthSlug),
                openContent = this.printDirective(construction),
                closeContent = construction.isClosedBy?.sourceContent as string;
            value = value.replace(open, openContent);
            value = value.replace(close, closeContent);
        });

        return value;
    }

    private transformForElseWithEmpty(content: string): string {
        let value = content;

        this.forElseWithEmpty.forEach((forElse: TransformedForElse) => {
            const truthOpen = this.open(forElse.truthSlug),
                construction = forElse.forElse.constructedFrom as DirectiveNode,
                constructionContent = this.printDirective(construction);

            value = value.replace(truthOpen, constructionContent);
            value = value.replace(forElse.pairClose, construction.isClosedBy?.sourceContent as string);
            value = value.replace(forElse.emptyOpen, forElse.forElse.elseNode?.sourceContent as string);
            this.removeLines.push(forElse.truthClose);
        });

        return value;
    }

    private transformInlineEcho(content: string): string {
        let value = content;

        this.inlineEchos.forEach((echo: BladeEchoNode, slug: string) => {
            const inline = this.selfClosing(slug);

            value = value.replace(inline, EchoPrinter.printEcho(echo, this.phpFormatter));
        });

        this.spanEchos.forEach((echo: BladeEchoNode, slug: string) => {
            value = value.replace(slug, EchoPrinter.printEcho(echo, this.phpFormatter));
        });

        return value;
    }

    private transformConditions(content: string): string {
        let value = content;

        this.conditions.forEach((condition) => {
            condition.structures.forEach((structure) => {
                const structureDirective = structure.branch.head as DirectiveNode;

                if (structure.virtualBreakOpen.length > 0) {
                    this.removeLines.push(structure.virtualBreakOpen);
                }

                if (structure.virtualBreakClose.length > 0) {
                    value = value.replace(structure.virtualBreakClose, structure.virtualBreakClose + "\n");
                    this.removeLines.push(structure.virtualBreakClose);
                }

                this.virtualStructureOpens.push(structure.virtualOpen);
                this.removeLines.push(structure.virtualOpen);
                this.removeLines.push(structure.virtualClose);

                if (!structure.isLast) {
                    this.removeLines.push(structure.pairClose);
                    value = value.replace(structure.pairOpen, this.printDirective(structureDirective));
                } else {
                    value = value.replace(structure.pairOpen, this.printDirective(structureDirective));
                    const closeDirective = structureDirective.isClosedBy as DirectiveNode;
                    value = value.replace(structure.pairClose, this.printDirective(closeDirective));
                }
            });
        });

        return value;
    }

    private transformSwitchStatements(content: string): string {
        let value = content;

        this.switchStatements.forEach((switchStatement) => {
            const open = switchStatement.switchNode.constructedFrom as DirectiveNode;

            value = value.replace(switchStatement.virtualSwitchOpen, this.printDirective(open));
            const closeDirective = open.isClosedBy as DirectiveNode;
            value = value.replace(switchStatement.virtualSwitchClose, closeDirective.sourceContent);

            switchStatement.structures.forEach((structure) => {
                const structureDirective = structure.case.head as DirectiveNode;
                this.removeLines.push(structure.virtualClose);
                this.removeLines.push(structure.virtualOpen);
                if (!structure.isLast) {
                    if (structure.isFirst) {
                        this.removeLines.push(structure.pairClose);
                        value = value.replace(structure.pairOpen, this.printDirective(structureDirective));
                    } else {
                        this.removeLines.push(structure.pairClose);
                        value = value.replace(structure.pairOpen, this.printDirective(structureDirective));
                    }
                } else {
                    value = value.replace(structure.pairOpen, this.printDirective(structureDirective));
                    this.removeLines.push(structure.pairClose);
                }
            });
        });

        return value;
    }

    private transformProps(content: string): string {
        let value = content;

        this.propDirectives.forEach((directive, slug) => {
            const close = this.close(slug),
                open = this.open(slug);
            this.removeLines.push(close);

            let content = directive.sourceContent;

            try {
                if (this.transformOptions.formatDirectivePhpParameters && this.phpFormatter != null && directive.hasValidPhp()) {
                    let params = directive.getPhpContent().trim();
                    if (params.startsWith('(') && params.endsWith(')')) {
                        params = params.substring(1);
                        params = params.substring(0, params.length - 1);
                    }
                    let tResult = this.phpFormatter('<?php ' + params);

                    tResult = StringUtilities.replaceAllInString(tResult, "\n", ' ');

                    const arrayParser = new SimpleArrayParser(),
                        array = arrayParser.parse(tResult),
                        targetIndent = this.indentLevel(open);

                    if (array != null) {
                        tResult = ArrayPrinter.print(array, this.transformOptions.tabSize, 1);

                        if (targetIndent > 0) {
                            tResult = StringUtilities.removeEmptyNewLines(IndentLevel.shiftIndent(tResult, targetIndent, true));
                        }

                        content = '@props' + ' '.repeat(this.transformOptions.spacesAfterDirective) + '(' + tResult + ')';
                    }
                }
            } catch (err) {
                content = directive.sourceContent;
            }

            value = value.replace(open, content);
        });

        return value;
    }

    private transformBreaks(content: string): string {
        let value = content;

        this.breakDirectives.forEach((directive, slug) => {
            const close = this.close(slug),
                open = this.open(slug);
            this.removeLines.push(close);

            value = value.replace(open, directive.sourceContent);
        });

        return value;
    }

    private transformComments(content: string): string {
        let value = content;

        this.inlineComments.forEach((comment, slug) => {
            const open = this.selfClosing(slug);

            value = value.replace(open, CommentPrinter.printComment(comment, this.transformOptions.tabSize, 0));
        });

        return value;
    }

    private indentLevel(value: string): number {
        for (let i = 0; i < this.structureLines.length; i++) {
            const thisLine = this.structureLines[i];

            if (thisLine.includes(value)) {
                const trimmed = thisLine.trimLeft();

                return thisLine.length - trimmed.length;
            }
        }
        return 0;
    }

    private transformVirtualComments(content: string): string {
        let value = content;

        this.blockComments.forEach((structure) => {
            const comment = structure.node as BladeCommentNode;

            value = value.replace(structure.pairOpen, CommentPrinter.printComment(comment, this.transformOptions.tabSize, this.indentLevel(structure.pairOpen)));
            this.removeLines.push(structure.pairClose);
            this.removeLines.push(structure.virtualElement);
        });

        return value;
    }

    private transformDynamicElementForElse(content: string): string {
        let value = content;

        this.dynamicElementForElseNodes.forEach((forElse, slug) => {
            value = StringUtilities.replaceAllInString(value, slug, forElse.nodeContent);
        });

        return value;
    }

    private transformDynamicElementConditions(content: string): string {
        let value = content;

        this.dynamicElementConditionNodes.forEach((condition, slug) => {
            value = StringUtilities.replaceAllInString(value, slug, condition.nodeContent);
        });

        return value;
    }

    private transformDynamicElementSwitch(content: string): string {
        let value = content;

        this.dynamicElementSwitchNodes.forEach((switchNode, slug) => {
            value = StringUtilities.replaceAllInString(value, slug, switchNode.nodeContent);
        });

        return value;
    }

    private transformDirectiveParameters(content: string): string {
        let value = content;

        this.directiveParameters.forEach((param, slug) => {
            const paramDirective = param.directive as DirectiveNode;

            value = value.replace(slug, this.printDirective(paramDirective));
        });

        return value;
    }

    private transformExpressionParameters(content: string): string {
        let value = content;

        this.expressionParameters.forEach((param, slug) => {
            value = value.replace(slug, param.content);
        });

        return value;
    }

    private transformEmbeddedEcho(content: string): string {
        let value = content;

        this.embeddedEchos.forEach((echo, slug) => {
            value = value.replace(slug, EchoPrinter.printEcho(echo, this.phpFormatter));
        });

        return value;
    }

    private transformEmbeddedDirectives(content: string): string {
        let value = content;

        this.embeddedDirectives.forEach((directive, slug) => {
            value = value.replace(slug, this.printDirective(directive));
        });

        return value;
    }

    private transformExtractedDocuments(content: string): string {
        let value = content;

        this.extractedEmbeddedDocuments.forEach((document, slug) => {
            let target = '',
                indent = 0;

            if (document.isScript) {
                target = '//' + slug;
            } else {
                target = '/*' + slug + '*/';
            }

            indent = this.indentLevel(target);

            if (value.includes(target)) {
                value = value.replace(target, IndentLevel.indentRelative(document.content, indent));
            }
        });

        return value;
    }

    private removeVirtualStructures(content: string): string {
        let value = content;

        this.removeLines.forEach((line) => {
            value = value.replace(line, '');
        });

        return value;
    }

    private forceCleanLines: string[] = [
        '@endphp',
        '@elseif',
        '@else',
        '@endif',
        '@endswitch',
        '@endverbatim',
        '@case',
        '@default',
    ];

    private shouldCleanAfter(line: string): boolean {
        for (let i = 0; i < this.removeLines.length; i++) {
            if (line.startsWith(this.removeLines[i])) {
                return true;
            }
        }

        return false;
    }

    private shouldCleanLine(line: string): boolean {
        for (let i = 0; i < this.forceCleanLines.length; i++) {
            if (line.startsWith(this.forceCleanLines[i])) {
                return true;
            }
        }

        return false;
    }

    cleanVirtualStructures(content: string): string {
        const newLines: string[] = [],
            contentLines = StringUtilities.breakByNewLine(content);

        let removeNewLines = false;

        for (let i = 0; i < contentLines.length; i++) {
            const checkLine = contentLines[i].trim();

            if (removeNewLines) {
                if (checkLine.length == 0) {
                    continue;
                } else {
                    removeNewLines = false;
                }
            } else {
                removeNewLines = this.shouldCleanAfter(checkLine);
            }

            if (this.shouldCleanLine(checkLine)) {
                for (let j = newLines.length - 1; j > 0; j--) {
                    const tLine = newLines[j];

                    if (tLine.trim().length == 0) {
                        newLines.pop();
                    } else {
                        break;
                    }
                }
            }

            if (this.removeLines.includes(checkLine)) {
                continue;
            } else {
                let newLine = contentLines[i];
                this.removeLines.forEach((line) => {
                    if (newLine.includes(line)) {
                        newLine = newLine.replace(line, '');
                    }
                });
                newLines.push(newLine);
            }
        }

        return newLines.join("\n");
    }

    private reflowSlugs(content: string): string {
        let result = content;

        this.slugs.forEach((slug) => {
            const open = this.open(slug),
                close = this.close(slug),
                selfClose = this.selfClosing(slug),
                openRegex = '/<' + slug + '(.*?)>/gms',
                closeRegex = '/</' + slug + '(.*?)>/gms',
                selfCloseRegex = '/<' + slug + '(.*?)/>/gms';
            result = result.replace(openRegex, open);
            result = result.replace(closeRegex, close);
            result = result.replace(selfCloseRegex, selfClose);
        });

        return result;
    }

    fromStructure(content: string) {
        const reflowedContent = this.reflowSlugs(content);

        this.structureLines = StringUtilities.breakByNewLine(reflowedContent);

        let results = this.transformInlineDirectives(reflowedContent);
        results = this.transformContentDirectives(results);
        results = this.transformDynamicEcho(results);
        results = this.transformPairedDirectives(results);
        results = this.transformForElseWithEmpty(results);
        results = this.transformForElseWithNoEmpty(results);
        results = this.transformDynamicElementForElse(results);
        results = this.transformInlineEcho(results);
        results = this.transformConditions(results);
        results = this.transformDynamicElementConditions(results);
        results = this.transformSwitchStatements(results);
        results = this.transformDynamicElementSwitch(results);
        results = this.transformBreaks(results);
        results = this.transformProps(results);
        results = this.transformComments(results);
        results = this.transformVirtualComments(results);
        results = this.transformDirectiveParameters(results);
        results = this.transformExpressionParameters(results);
        results = this.transformDynamicDirectives(results);
        results = this.cleanVirtualStructures(results);
        results = this.removeVirtualStructures(results);
        results = this.transformEmbeddedEcho(results);
        results = this.transformEmbeddedDirectives(results);
        results = this.transformExtractedDocuments(results);
        results = this.transformPhpBlock(results);

        return results;
    }
}