import { formatExtractedScript } from '../formatting/bladeJavaScriptFormatter';
import { getDefaultClassStringConfig } from '../formatting/classStringsConfig';
import { FormattingOptions } from '../formatting/formattingOptions';
import { GeneralSyntaxReflow } from '../formatting/generalSyntaxReflow';
import { formatBladeString, formatBladeStringWithPint, getPhpOptions } from '../formatting/prettier/utils';
import { VoidHtmlTagsManager } from '../formatting/prettier/voidHtmlTagsManager';
import { SyntaxReflow } from '../formatting/syntaxReflow';
import { AbstractNode, BladeCommentNode, BladeComponentNode, BladeEchoNode, ConditionNode, DirectiveNode, ExecutionBranchNode, ForElseNode, FragmentPosition, InlinePhpNode, LiteralNode, ParameterNode, ParameterType, SwitchCaseNode, SwitchStatementNode } from '../nodes/nodes';
import { IExtractedAttribute } from '../parser/extractedAttribute';
import { SimpleArrayParser } from '../parser/simpleArrayParser';
import { StringUtilities } from '../utilities/stringUtilities';
import { canProcessAttributes, disableAttributeProcessing, enableAttributeProcessing } from './attributeRangeRemover';
import { BladeDocument } from './bladeDocument';
import { BlockPhpFormatter, JsonFormatter, PhpFormatter, PhpTagFormatter } from './formatters';
import { PintTransformer } from './pintTransformer';
import { ArrayPrinter } from './printers/arrayPrinter';
import { CommentPrinter } from './printers/commentPrinter';
import { DirectivePrinter } from './printers/directivePrinter';
import { EchoPrinter } from './printers/echoPrinter';
import { IndentLevel } from './printers/indentLevel';
import { getPrintWidth } from './printers/printWidthUtils';
import { TransformIgnore } from './transformIgnore';
import { TransformOptions } from './transformOptions';

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
    virtualBreakClose: string,
    isLiteralContent: boolean,
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
    private isInsideIgnoreFormatter: boolean = false;
    private ignoredLiteralBlocks: Map<string, AbstractNode[]> = new Map();
    private activeLiteralSlug: string = '';
    private doc: BladeDocument;
    private shadowDoc: BladeDocument | null = null;
    private inlineDirectiveBlocks: Map<string, DirectiveNode> = new Map();
    private contentDirectives: Map<string, DirectiveNode> = new Map();
    private dynamicEchoBlocks: Map<string, BladeEchoNode> = new Map();
    private dynamicAttributeEchoBlocks: Map<string, BladeEchoNode> = new Map();
    private pairedDirectives: Map<string, TransformedPairedDirective> = new Map();
    private dynamicInlineDirectives: Map<string, string> = new Map();
    private inlineDirectives: Map<string, TransformedPairedDirective> = new Map();
    private attachedDirectives: Map<string, TransformedPairedDirective> = new Map();
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
    private htmlTagComments: Map<string, BladeCommentNode> = new Map();
    private blockComments: VirtualBlockStructure[] = [];
    private blockPhpNodes: Map<string, InlinePhpNode> = new Map();
    private breakDirectives: Map<string, DirectiveNode> = new Map();
    private htmlTagDirectives: Map<string, DirectiveNode> = new Map();
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
    private echoParameters: Map<string, ParameterNode> = new Map();
    private slugs: string[] = [];
    private extractedEmbeddedDocuments: Map<string, EmbeddedDocument> = new Map();
    private propDirectives: Map<string, DirectiveNode> = new Map();
    private useLaravelPint: boolean = false;
    private pintTransformer: PintTransformer | null = null;
    private filePath: string = '';
    private formattingOptions: FormattingOptions | null = null;
    private didPintFail: boolean = false;
    private removedAttributes: Map<string, IExtractedAttribute> = new Map();
    private shorthandSlotAttributes: Map<string, string> = new Map();
    private shorthandSlotAttributeReference: Map<string, BladeComponentNode> = new Map();

    private phpFormatter: PhpFormatter | null = null;
    private blockPhpFormatter: BlockPhpFormatter | null = null;
    private phpTagFormatter: BlockPhpFormatter | null = null;
    private jsonFormatter: JsonFormatter | null = null;

    private transformOptions: TransformOptions = {
        spacesAfterDirective: 0,
        spacesAfterControlDirective: 1,
        tabSize: 4,
        formatDirectiveJsonParameters: true,
        formatDirectivePhpParameters: true,
        formatInsideEcho: true,
        phpOptions: null,
        attributeJsOptions: null,
        echoStyle: 'block',
        useLaravelPint: false,
        pintCommand: 'pint {filename}',
        pintTempDirectory: '',
        pintCacheDirectory: '',
        pintCacheEnabled: true,
        pintConfigPath: '',
        classStrings: getDefaultClassStringConfig(),
        formatJsAttributes: true,
        excludeJsAttributes: [],
        safeWrappingJsAttributes: [
            '^x-data',
        ],
        includeJsAttributes: [
            '^x-'
        ]
    }

    constructor(doc: BladeDocument) {
        this.doc = doc;
    }

    withShadowDocument(shadow: BladeDocument | null = null) {
        this.shadowDoc = shadow;

        return this;
    }

    getPintTransformer(): PintTransformer | null {
        return this.pintTransformer;
    }

    setPintTransformer(transformer: PintTransformer | null) {
        this.pintTransformer = transformer;
    }

    setUsingLaravelPint(usingPint: boolean) {
        this.useLaravelPint = usingPint;
    }

    getUsingLaravelPint(): boolean {
        return this.useLaravelPint;
    }

    withRemovedAttributes(attributes: Map<string, IExtractedAttribute>) {
        this.removedAttributes = attributes;

        return this;
    }

    setParentTransformer(transformer: Transformer) {
        this.parentTransformer = transformer;
        this.cloneOptions(transformer);

        return this;
    }

    cloneOptions(transformer: Transformer) {
        this.setUsingLaravelPint(transformer.getUsingLaravelPint());
        this.setPintTransformer(transformer.getPintTransformer());

        return this;
    }

    getFormattingOptions() {
        return this.formattingOptions;
    }

    setFormattingOptions(formattingOptions: FormattingOptions | null) {
        this.formattingOptions = formattingOptions;

        return this;
    }

    withJsonFormatter(formatter: JsonFormatter | null) {
        this.jsonFormatter = formatter;

        return this;
    }

    getJsonFormatter() {
        return this.jsonFormatter;
    }

    withFilePath(path: string) {
        this.filePath = path;

        return this;
    }

    withBlockPhpFormatter(formatter: BlockPhpFormatter | null) {
        this.blockPhpFormatter = formatter;

        return this;
    }

    getBlockPhpFormatter() {
        return this.blockPhpFormatter;
    }

    withPhpTagFormatter(formatter: PhpTagFormatter | null) {
        this.phpTagFormatter = formatter;

        return this;
    }

    getPhpTagFormatter() {
        return this.phpTagFormatter;
    }

    withPhpFormatter(formatter: PhpFormatter | null) {
        this.phpFormatter = formatter;

        return this;
    }

    getPhpFormatter() {
        return this.phpFormatter;
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

    private printDirective(directive: DirectiveNode, indentLevel: number): string {
        return DirectivePrinter.printDirective(
            directive,
            this.transformOptions,
            this.phpFormatter,
            this.jsonFormatter,
            indentLevel,
            this.pintTransformer
        );
    }

    private makeSlug(length: number): string {
        const slug = StringUtilities.makeSlug(length);

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

    private registerShorthandSlot(component: BladeComponentNode): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerShorthandSlot(component);
        }

        const slug = this.makeSlug(20);

        this.shorthandSlotAttributes.set(component.refId as string, slug);
        this.shorthandSlotAttributeReference.set(slug, component);

        return slug;
    }

    private getSlotSlug(refId: string): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.getSlotSlug(refId);
        }

        if (this.shorthandSlotAttributes.has(refId)) {
            return this.shorthandSlotAttributes.get(refId) as string;
        }

        return '';
    }

    private registerEchoParameter(slug: string, param: ParameterNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerEchoParameter(slug, param);
        } else {
            this.echoParameters.set(slug, param);
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

    private registerAttachedDirective(slug: string, directive: TransformedPairedDirective) {
        if (this.parentTransformer != null) {
            this.parentTransformer.registerAttachedDirective(slug, directive);
        } else {
            this.attachedDirectives.set(slug, directive);
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

        if (directive.nextNode != null) {
            const placementDiff = (directive.nextNode.startPosition?.offset ?? 0) - (directive.endPosition?.offset ?? 0);

            if (directive.nextNode instanceof LiteralNode) {
                const trailingLiteral = directive.nextNode;

                if ((trailingLiteral.content.length - trailingLiteral.content.trimLeft().length) > 0) {
                    return slug;
                } else {
                    if (trailingLiteral.content.length == 0) {
                        return slug;
                    } else {
                        const firstTrailingChar = trailingLiteral.content[0];

                        if (StringUtilities.ctypePunct(firstTrailingChar) || StringUtilities.ctypeSpace(firstTrailingChar)) {
                            return slug;
                        } else {
                            return slug + ' ';
                        }
                    }
                }
            } else {
                if (placementDiff > 0) {
                    return slug + ' ';
                } else {
                    return slug;
                }
            }
        }

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

    private transformComponentSlots(content: string): string {
        let result = content;

        this.shorthandSlotAttributeReference.forEach((component, slug) => {
            const open = `<x-${slug}`,
                close = `</x-${slug}`,
                inlineName = component.name?.inlineName as string,
                replace = `<x-slot:${inlineName}`;
            result = StringUtilities.safeReplaceAllInString(result, close, '</x-slot');
            result = StringUtilities.safeReplaceAllInString(result, open, replace);
        });

        return result;
    }

    private preparePhpBlock(php: InlinePhpNode): string {
        if (php.fragmentPosition == FragmentPosition.IsDynamicFragmentName) {
            return this.prepareConditionalPhpBlock(php);
        }

        if (php.isInline || php.fragmentPosition == FragmentPosition.InsideFragment || php.fragmentPosition == FragmentPosition.InsideFragmentParameter) {
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

            if (this.transformOptions.formatDirectivePhpParameters && php.hasValidPhp()) {
                if (this.useLaravelPint) {
                    if (this.pintTransformer != null) {
                        result = this.pintTransformer.getPhpBlockContent(php);
                    }
                } else {
                    if (this.phpTagFormatter != null) {
                        result = this.phpTagFormatter(result, this.transformOptions, null);

                        if (GeneralSyntaxReflow.couldReflow(result)) {
                            result = GeneralSyntaxReflow.instance.reflow(result);
                        }

                        if (SyntaxReflow.couldReflow(result)) {
                            result = SyntaxReflow.instance.reflow(result);
                        }
                    }
                }

                result = IndentLevel.shiftIndent(
                    result,
                    targetIndent,
                    true,
                    this.transformOptions
                );
            }

            value = StringUtilities.safeReplace(value, open, result);
        });

        this.dynamicElementPhpNodes.forEach((php, slug) => {
            value = StringUtilities.safeReplaceAllInString(value, slug, this.printInlinePhp(php));
        });

        this.inlinePhpNodes.forEach((php, slug) => {
            value = StringUtilities.safeReplace(value, slug, this.printInlinePhp(php));
        });

        return value;
    }

    private printInlinePhp(php: InlinePhpNode): string {
        let phpContent = php.sourceContent;

        if (this.phpTagFormatter && php.hasValidPhp()) {
            phpContent = this.phpTagFormatter(phpContent, this.transformOptions, null);

            if (GeneralSyntaxReflow.couldReflow(phpContent)) {
                phpContent = GeneralSyntaxReflow.instance.reflow(phpContent);
            }

            if (SyntaxReflow.couldReflow(phpContent)) {
                phpContent = SyntaxReflow.instance.reflow(phpContent);
            }

            phpContent = StringUtilities.safeReplaceAllInString(phpContent, "\n", ' ');
        }

        return phpContent;
    }

    private shouldCreateVirutal(directive: DirectiveNode): boolean {
        const children = directive.getImmediateChildren();

        if (children.length == 0) {
            return true;
        }

        let allEchosInline = true,
            allLiteralsWhitespace = true,
            inlineEchos = 0,
            bladeCount = 0,
            literalCount = 0,
            createVirtual = true;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child instanceof BladeEchoNode && child.isInlineEcho) {
                allEchosInline = false;
                inlineEchos += 1;
                bladeCount += 1;
            } else if (child instanceof LiteralNode) {
                literalCount += 1;
                if (child.content.trim().length > 0) {
                    allLiteralsWhitespace = false;
                }
            } else {
                bladeCount += 1;
            }
        }

        if (inlineEchos == 0) {
            createVirtual = true;
        }

        if (bladeCount > 0 && allEchosInline == true) {
            return false;
        }

        if (allLiteralsWhitespace == false && bladeCount == 0) {
            createVirtual = true;
        }

        if (allLiteralsWhitespace == true && bladeCount == 0) {
            createVirtual = true;
        }

        return createVirtual;
    }

    private preparePairedDirective(directive: DirectiveNode): string {
        const slug = this.makeSlug(directive.sourceContent.length),
            directiveName = directive.directiveName.toLowerCase(),
            innerDoc = directive.childrenDocument?.document.transform().setParentTransformer(this).toStructure() as string;

        if (directive.fragmentPosition != FragmentPosition.IsDynamicFragmentName) {

            if (directive.originalAbstractNode != null && directive.originalAbstractNode.prevNode instanceof BladeEchoNode && directive.originalAbstractNode instanceof DirectiveNode && directive.originalAbstractNode.directiveName == 'if') {
                const distance = (directive.originalAbstractNode.startPosition?.index ?? 0) - (directive.originalAbstractNode.prevNode.endPosition?.index ?? 0);

                if (distance > 0 && distance < 3) {
                    this.registerAttachedDirective(slug, {
                        directive: directive,
                        innerDoc: innerDoc,
                        slug: slug,
                        isInline: false,
                        virtualElementSlug: ''
                    });
                    return slug;
                }
            }

            let virtualSlug = '';
            let result = `${this.open(slug)}\n`;
            if (directiveName == 'php' || directiveName == 'verbatim') {
                virtualSlug = this.makeSlug(15);
                result += this.pair(virtualSlug);
            } else {
                const contentContainsAllInline = this.isAllInlineNodes(directive.children ?? []),
                    containsBladeStructures = this.containsBladeStructures(directive.children ?? []);
                if ((this.shouldCreateVirutal(directive) && directive.containsChildStructures == false &&
                    directive.containsAnyFragments == false &&
                    !contentContainsAllInline &&
                    !containsBladeStructures) || (!directive.containsAnyFragments && contentContainsAllInline && containsBladeStructures)) {
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

    private prepareHtmlTagDirective(directive: DirectiveNode): string {
        if (this.parentTransformer != null) {
            return this.prepareHtmlTagDirective(directive);
        }

        const slug = StringUtilities.makeSlug(32);

        this.htmlTagDirectives.set(slug, directive);

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
        if (directive.fragmentPosition == FragmentPosition.InsideFragment && directive.isClosedBy != null) {
            return this.prepareHtmlTagDirective(directive);
        }

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

    private registerHtmlTagComment(comment: BladeCommentNode): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerHtmlTagComment(comment);
        }

        const slug = StringUtilities.makeSlug(64);

        this.htmlTagComments.set(slug, comment);

        return slug;
    }

    private prepareComment(comment: BladeCommentNode): string {
        if (comment.isPartOfHtmlTag()) {
            return this.registerHtmlTagComment(comment);
        }
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

    private registerDynamicAttributeFragmentEcho(echo: BladeEchoNode): string {
        if (this.parentTransformer != null) {
            return this.parentTransformer.registerDynamicFragmentEcho(echo);
        } else {
            const slug = this.makeSlug(echo.sourceContent.length);
            this.dynamicAttributeEchoBlocks.set(slug, echo);

            return `${slug}="${slug}"`;
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
                if (component.isOpenedBy != null) {
                    if (component.isOpenedBy.isShorthandSlot) {
                        const parentRefId = component.isOpenedBy.refId as string,
                            parentSlug = this.getSlotSlug(parentRefId);
                        return `</x-${parentSlug}>`;
                    }
                }

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

                if (component.isClosedBy != null) {
                    value += this.registerShorthandSlot(component);
                } else {
                    value += 'slot name="' + slotName + '"';
                }
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
                } else if (param.type == ParameterType.InlineEcho && param.inlineEcho != null) {
                    const echoSlug = this.makeSlug(param.inlineEcho.content.length);
                    this.registerEchoParameter(echoSlug, param);
                    value += echoSlug + ' ';
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
        } else if (echo.fragmentPosition == FragmentPosition.InsideFragmentParameter) {
            return this.registerDynamicFragmentEcho(echo);
        } else if (echo.fragmentPosition == FragmentPosition.InsideFragment) {
            if (echo.prevNode != null && !(echo.prevNode instanceof LiteralNode)) {
                return this.registerInlineEcho(echo);
            }

            if (echo.nextNode != null) {
                if (echo.nextNode instanceof LiteralNode) {
                    const trailingLiteral = echo.nextNode;

                    if ((trailingLiteral.content.length - trailingLiteral.content.trimLeft().length) > 0) {
                        return this.registerDynamicAttributeFragmentEcho(echo);
                    } else {
                        if (trailingLiteral.content.length == 0) {

                            return this.registerDynamicAttributeFragmentEcho(echo);
                        } else {
                            const firstTrailingChar = trailingLiteral.content[0];

                            if (!StringUtilities.ctypeSpace(firstTrailingChar)) {
                                return this.registerDynamicFragmentEcho(echo);
                            }
                        }
                    }
                } else {
                    return this.registerInlineEcho(echo);
                }
            }

            return this.registerDynamicAttributeFragmentEcho(echo);
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

    private containsComponents(nodes: AbstractNode[]): boolean {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i] instanceof BladeComponentNode) {
                return true;
            }
        }
        return false;
    }

    private containsBladeStructures(nodes: AbstractNode[]): boolean {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (!(node instanceof LiteralNode)) {
                if (node instanceof DirectiveNode && (node.isClosingDirective || node.isClosingDirective || node.name == 'elseif' || node.name == 'else')) {
                    continue;
                }

                return true;
            }
        }
        return false;
    }

    private isAllInlineNodes(nodes: AbstractNode[]): boolean {
        let echoCount = 0;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (node instanceof LiteralNode) { continue; }
            if (node instanceof BladeEchoNode) {
                if (!node.isInlineEcho) {
                    return false;
                }
                echoCount += 1;
            } else {
                if (node instanceof DirectiveNode) {
                    if (node.isClosingDirective || node.name == 'elseif' || node.name == 'else') {
                        continue;
                    }
                    return false;
                } else {
                    return false;
                }
            }
        }
        if (echoCount == 0) {
            return false;
        }
        return true;
    }

    private prepareConditions(condition: ConditionNode): string {
        if (condition.fragmentPosition == FragmentPosition.Unresolved) {
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
                    virtualBreakOpen: '',
                    isLiteralContent: false,
                };

                if (branch.head?.directiveName == 'else') {
                    result += "\n" + tBranch.pairOpen;
                    const virtualBreakSlug = this.makeSlug(25),
                        containsBladeStructures = this.containsBladeStructures(branch.head.children ?? []);

                    if (branch.head.containsChildStructures == false && branch.head.containsAnyFragments == false &&
                        ((branch.head?.children.length <= 2 || branch.head?.children.length > 4) &&
                            !this.isAllInlineNodes(branch.head.children) &&
                            !containsBladeStructures)) {


                        tBranch.virtualBreakOpen = this.open(virtualBreakSlug);
                        tBranch.virtualBreakClose = this.close(virtualBreakSlug);
                        result += "\n" + tBranch.virtualBreakOpen + "\n";
                        result += innerDoc;
                        result += "\n" + tBranch.virtualBreakClose + "\n" + tBranch.pairClose;
                    } else {
                        tBranch.virtualBreakOpen = this.selfClosing(virtualBreakSlug);
                        result += tBranch.virtualBreakOpen + "\n";
                        result += innerDoc;
                        result += "\n" + tBranch.pairClose;
                    }
                } else {
                    const branchContainsAllInline = this.isAllInlineNodes(branch.head?.children ?? []),
                        containsBladeStructures = this.containsBladeStructures(branch.head?.children ?? []);
                    if (branch.head?.containsAnyFragments == false &&
                        branch.head?.containsChildStructures == false &&
                        (branch.head?.children.length <= 2 || branch.head?.children.length > 4) &&
                        !branchContainsAllInline && !containsBladeStructures) {
                        const ifBreakSlug = this.makeSlug(25);

                        tBranch.virtualBreakOpen = this.open(ifBreakSlug);
                        tBranch.virtualBreakClose = this.close(ifBreakSlug);

                        if (branch.head?.children.length <= 2 && branch.head.children[0] instanceof LiteralNode) {
                            result += tBranch.pairOpen;
                            result += "\n" + tBranch.virtualBreakOpen;
                            result += "\n" + tBranch.virtualBreakClose;
                            result += tBranch.pairClose;
                            tBranch.isLiteralContent = true;
                        } else {
                            result += tBranch.pairOpen;
                            result += "\n" + tBranch.virtualBreakOpen;
                            result += innerDoc;
                            result += "\n" + tBranch.virtualBreakClose;
                            result += tBranch.pairClose;
                        }
                    } else {
                        if (branchContainsAllInline) {
                            result += "\n" + tBranch.pairOpen;
                            const virtualBreakSlug = this.makeSlug(25);
                            tBranch.virtualBreakOpen = this.selfClosing(virtualBreakSlug);
                            result += tBranch.virtualBreakOpen + "\n";
                            result += innerDoc;
                            result += "\n" + tBranch.pairClose;
                        } else {
                            result += tBranch.pairOpen;
                            result += "\n";
                            result += innerDoc;
                            result += "\n";
                            result += tBranch.pairClose;
                        }
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

        if (condition.fragmentPosition == FragmentPosition.InsideFragmentParameter ||
            condition.fragmentPosition == FragmentPosition.InsideFragment) {

            if (condition.logicBranches.length > 0) {
                // Get the very last item.
                const lastBranch = condition.logicBranches[condition.logicBranches.length - 1];

                if (lastBranch.head != null && lastBranch.head.isClosedBy != null) {
                    // Check for distance between nodes.
                    if (lastBranch.head.isClosedBy.nextNode != null) {
                        const placementDiff = (lastBranch.head.isClosedBy.nextNode.startPosition?.offset ?? 0) - (lastBranch.head.isClosedBy.endPosition?.offset ?? 0);

                        if (lastBranch.head.isClosedBy.nextNode instanceof LiteralNode) {
                            const trailingLiteral = lastBranch.head.isClosedBy.nextNode;

                            if ((trailingLiteral.content.length - trailingLiteral.content.trimLeft().length) > 0) {
                                return slug;
                            } else {
                                if (trailingLiteral.content.length == 0) {
                                    return slug;
                                } else {
                                    const firstTrailingChar = trailingLiteral.content[0];

                                    if (StringUtilities.ctypePunct(firstTrailingChar) || StringUtilities.ctypeSpace(firstTrailingChar)) {
                                        return slug;
                                    } else {
                                        return slug + ' ';
                                    }
                                }
                            }
                        } else {
                            if (placementDiff > 0) {
                                return slug + ' ';
                            } else {
                                return slug;
                            }
                        }
                    }
                }
            }

            return slug;
        }

        return slug + ' ';
    }

    toStructure(): string {
        let result = '';

        if (this.useLaravelPint && canProcessAttributes) {
            if (this.parentTransformer == null) {
                this.pintTransformer = new PintTransformer(
                    this.transformOptions.pintTempDirectory,
                    this.transformOptions.pintCacheDirectory,
                    this.transformOptions.pintCommand,
                    this.transformOptions.pintConfigPath
                );
                this.pintTransformer.setTemplateFilePath(this.filePath);

                // If the shadow document is available we will
                // use that instead. When this happens, it is
                // very likely that the "doc" we have access
                // to has been modified to accomodate things
                // like the formatting of AlpineJS attributes.
                if (this.shadowDoc != null) {
                    this.pintTransformer.format(this.shadowDoc);
                } else {
                    this.pintTransformer.format(this.doc);
                }

                this.didPintFail = this.pintTransformer.getDidFail();
            }
        }

        let nodes = this.doc.getRenderNodes();

        nodes.forEach((node) => {
            if (this.isInsideIgnoreFormatter) {
                this.pushLiteralBlock(this.activeLiteralSlug, node);

                if (node instanceof BladeCommentNode) {
                    if (node.innerContent.trim().toLowerCase() == TransformIgnore.FormatIgnoreEnd) {
                        this.isInsideIgnoreFormatter = false;
                        return;
                    }
                }
                return;
            }

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
                if (node.innerContent.trim() == TransformIgnore.FormatIgnoreStart) {
                    this.isInsideIgnoreFormatter = true;
                    this.activeLiteralSlug = this.makeSlug(16);
                    this.pushStartLiteralBlock(this.activeLiteralSlug, node);

                    result += this.selfClosing(this.activeLiteralSlug);
                } else {
                    result += this.prepareComment(node);
                }
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

        this.useLaravelPint = this.transformOptions.useLaravelPint;

        return this;
    }

    private transformInlineDirectives(content: string): string {
        let value = content;
        this.inlineDirectiveBlocks.forEach((directive, slug) => {
            const search = this.selfClosing(slug),
                replace = this.printDirective(directive, this.indentLevel(search));

            value = StringUtilities.safeReplace(value, search, replace);
        });

        return value;
    }

    private transformContentDirectives(content: string): string {
        let value = content;

        this.contentDirectives.forEach((directive: DirectiveNode, slug: string) => {
            let directiveResult = this.printDirective(directive, 0);

            if (directiveResult.includes("\n")) {
                const relativeIndent = this.indentLevel(slug);

                if (relativeIndent > 0) {
                    directiveResult = IndentLevel.shiftIndent(
                        directiveResult,
                        relativeIndent,
                        true,
                        this.transformOptions
                    );
                }
            }

            value = StringUtilities.safeReplace(value, slug, directiveResult);
        });

        this.htmlTagDirectives.forEach((directive: DirectiveNode, slug: string) => {
            let attachedDoc = `${directive.sourceContent}
    ${directive.documentContent}
${directive.isClosedBy?.sourceContent}
`;

            disableAttributeProcessing();
            if (this.transformOptions.useLaravelPint) {
                attachedDoc = formatBladeStringWithPint(attachedDoc, this.formattingOptions, this.transformOptions).trim();
            } else {
                attachedDoc = formatBladeString(attachedDoc, this.formattingOptions).trim();
            }
            enableAttributeProcessing();
            const indentLevel = IndentLevel.relativeIndentLevel(slug, value);

            value = StringUtilities.safeReplace(value, slug, attachedDoc);
        });

        return value;
    }

    private transformDynamicEcho(content: string): string {
        let value = content;
        this.dynamicEchoBlocks.forEach((echo: BladeEchoNode, slug: string) => {
            const echoContent = EchoPrinter.printEcho(echo, this.transformOptions, this.phpFormatter, this.indentLevel(slug), this.pintTransformer);

            value = StringUtilities.safeReplaceAllInString(value, slug, echoContent);
        });

        return value;
    }

    private transformDynamicDirectives(content: string): string {
        let value = content;

        this.dynamicElementDirectiveNodes.forEach((directive, slug) => {
            const directiveContent = this.printDirective(directive, this.indentLevel(slug));

            value = StringUtilities.safeReplaceAllInString(value, slug, directiveContent);
        });

        return value;
    }

    private transformBlockPhp(content: string, withNewLine: boolean): string {
        if (this.blockPhpFormatter == null) { return content; }
        let value = content.trim();

        if (value.startsWith('<?php') == false) {
            value = '<?php ' + value;
        }

        const phpOptions = getPhpOptions();

        value = this.blockPhpFormatter(value, this.transformOptions, {
            ...phpOptions,
            printWidth: getPrintWidth(content, phpOptions.printWidth)
        });

        if (withNewLine) {
            value = "\n" + value + "\n";
        }

        if (GeneralSyntaxReflow.couldReflow(value)) {
            value = GeneralSyntaxReflow.instance.reflow(value);
        }

        if (SyntaxReflow.couldReflow(value)) {
            value = SyntaxReflow.instance.reflow(value);
        }

        return value;
    }

    private removeLeadingWhitespace(source: string, substring: string): string {
        const index = source.indexOf(substring);
        if (index === -1) {
            return source;
        }

        const beforeSubstring = source.slice(0, index);
        const afterSubstring = source.slice(index + substring.length);
        const trimmedBefore = beforeSubstring.replace(/[\s\uFEFF\xA0]+$/g, '');
        return trimmedBefore + substring + afterSubstring;
    }

    private findNewLeadingStart(content: string, substring: string): number {
        const lines = StringUtilities.breakByNewLine(content);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.includes(substring)) {
                return line.length - line.trim().length;
            }
        }
        return -1;
    }

    private transformPairedDirectives(content: string): string {
        let value = content;

        this.attachedDirectives.forEach((directive: TransformedPairedDirective, slug: string) => {
            value = this.removeLeadingWhitespace(value, slug);
            let attachedDoc = directive.directive.documentContent;

            disableAttributeProcessing();
            if (this.transformOptions.useLaravelPint) {
                attachedDoc = formatBladeStringWithPint(attachedDoc, this.formattingOptions, this.transformOptions).trim();
            } else {
                attachedDoc = formatBladeString(attachedDoc, this.formattingOptions).trim();
            }
            enableAttributeProcessing();

            const dirResult = this.printDirective(directive.directive, this.indentLevel(slug)).trim(),
                relIndent = this.findNewLeadingStart(value, slug),
                tmpDoc = dirResult + attachedDoc + "\n" + directive.directive.isClosedBy?.sourceContent ?? '';

            let insertResult = IndentLevel.shiftIndent(tmpDoc, relIndent + this.transformOptions.tabSize, true, this.transformOptions, false, true);
            value = StringUtilities.safeReplace(value, slug, insertResult);
        });

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

            let placeClosingDirective = true;

            if (originalDirective.directiveName.trim().toLowerCase() == 'php') {
                const virtualOpen = this.open(directive.virtualElementSlug),
                    targetIndent = this.indentLevel(virtualOpen),
                    replacePhp = directive.directive.sourceContent;

                let formattedPhp = originalDirective.documentContent;

                if (this.transformOptions.formatDirectivePhpParameters) {
                    if (!this.useLaravelPint) {
                        formattedPhp = IndentLevel.shiftIndent(
                            this.transformBlockPhp(originalDirective.innerContent, true),
                            targetIndent,
                            true,
                            this.transformOptions
                        );

                        value = StringUtilities.safeReplace(value, open, replacePhp);
                        value = StringUtilities.safeReplace(value, virtualOpen, formattedPhp);
                    } else {
                        if (this.pintTransformer != null) {
                            formattedPhp = this.pintTransformer.getDirectivePhpContent(originalDirective).trim();
                            const lines = StringUtilities.breakByNewLine(formattedPhp),
                                reflow: string[] = [];

                            for (let i = 0; i < lines.length; i++) {
                                if (lines[i].trim().length == 0) {
                                    reflow.push('');
                                    continue;
                                }
                                reflow.push(' '.repeat(targetIndent) + lines[i]);
                            }

                            formattedPhp = reflow.join("\n");

                            value = StringUtilities.safeReplace(value, open, replacePhp + "\n" + formattedPhp);
                            value = StringUtilities.safeReplace(value, virtualOpen, '');
                        } else {
                            value = StringUtilities.safeReplace(value, open, replacePhp);
                            value = StringUtilities.safeReplace(value, virtualOpen, formattedPhp);
                        }
                    }
                } else {
                    value = StringUtilities.safeReplace(value, open, replacePhp + "\n" + formattedPhp);
                    value = StringUtilities.safeReplace(value, virtualOpen, '');
                }
            } else if (originalDirective.directiveName.trim().toLowerCase() == 'verbatim') {
                if (originalDirective.isClosedBy != null && originalDirective.startPosition?.line == originalDirective.isClosedBy.startPosition?.line) {
                    value = StringUtilities.safeReplace(value, open, directive.directive.nodeContent);
                    placeClosingDirective = false;
                } else {
                    const replaceVerbatim = directive.directive.sourceContent + "\n" + IndentLevel.shiftClean(
                        originalDirective.innerContent, this.transformOptions.tabSize
                    );
                    value = StringUtilities.safeReplace(value, open, replaceVerbatim);
                }
            } else {
                value = StringUtilities.safeReplace(value, open, this.printDirective(directive.directive, this.indentLevel(open)));
            }

            if (placeClosingDirective) {
                value = StringUtilities.safeReplace(value, close, directive.directive.isClosedBy?.sourceContent as string);
            } else {
                value = StringUtilities.safeReplace(value, close, '');
            }
        });

        this.inlineDirectives.forEach((directive, slug) => {
            value = StringUtilities.safeReplaceAllInString(value, slug, directive.directive.nodeContent);
        });

        return value;
    }

    private transformForElseWithNoEmpty(content: string): string {
        let value = content;

        this.forElseNoEmpty.forEach((forElse: TransformedForElse) => {
            const construction = forElse.forElse.constructedFrom as DirectiveNode,
                open = this.open(forElse.truthSlug),
                close = this.close(forElse.truthSlug),
                openContent = this.printDirective(construction, this.indentLevel(open)),
                closeContent = construction.isClosedBy?.sourceContent as string;
            value = StringUtilities.safeReplace(value, open, openContent);
            value = StringUtilities.safeReplace(value, close, closeContent);
        });

        return value;
    }

    private transformForElseWithEmpty(content: string): string {
        let value = content;

        this.forElseWithEmpty.forEach((forElse: TransformedForElse) => {
            const truthOpen = this.open(forElse.truthSlug),
                construction = forElse.forElse.constructedFrom as DirectiveNode,
                constructionContent = this.printDirective(construction, this.indentLevel(truthOpen));

            value = StringUtilities.safeReplace(value, truthOpen, constructionContent);
            value = StringUtilities.safeReplace(value, forElse.pairClose, construction.isClosedBy?.sourceContent as string);
            value = StringUtilities.safeReplace(value, forElse.emptyOpen, forElse.forElse.elseNode?.sourceContent as string);
            this.removeLines.push(forElse.truthClose);
        });

        return value;
    }

    private transformInlineEcho(content: string): string {
        let value = content;

        this.inlineEchos.forEach((echo: BladeEchoNode, slug: string) => {
            const inline = this.selfClosing(slug);

            value = StringUtilities.safeReplace(value, inline, EchoPrinter.printEcho(echo, this.transformOptions, this.phpFormatter, this.indentLevel(slug), this.pintTransformer));
        });

        this.spanEchos.forEach((echo: BladeEchoNode, slug: string) => {
            value = StringUtilities.safeReplace(value, slug, EchoPrinter.printEcho(echo, this.transformOptions, this.phpFormatter, this.indentLevel(slug), this.pintTransformer));
        });

        return value;
    }

    pushStartLiteralBlock(slug: string, node: AbstractNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.pushStartLiteralBlock(slug, node);
        } else {
            this.ignoredLiteralBlocks.set(slug, []);
            this.ignoredLiteralBlocks.get(slug)?.push(node);
        }
    }

    pushLiteralBlock(slug: string, node: AbstractNode) {
        if (this.parentTransformer != null) {
            this.parentTransformer.pushLiteralBlock(slug, node);
        } else {
            this.ignoredLiteralBlocks.get(slug)?.push(node);
        }
    }

    private transformConditions(content: string): string {
        let value = content;

        this.conditions.forEach((condition) => {
            condition.structures.forEach((structure) => {
                const structureDirective = structure.branch.head as DirectiveNode;

                if (structure.isLiteralContent) {
                    value = StringUtilities.safeReplace(value, structure.virtualBreakOpen, structure.doc.trim());
                }

                if (structure.virtualBreakOpen.length > 0) {
                    this.removeLines.push(structure.virtualBreakOpen);
                }

                if (structure.virtualBreakClose.length > 0) {
                    value = StringUtilities.safeReplace(value, structure.virtualBreakClose, structure.virtualBreakClose + "\n");
                    this.removeLines.push(structure.virtualBreakClose);
                }

                this.virtualStructureOpens.push(structure.virtualOpen);
                this.removeLines.push(structure.virtualOpen);
                this.removeLines.push(structure.virtualClose);

                if (!structure.isLast) {
                    this.removeLines.push(structure.pairClose);
                    value = StringUtilities.safeReplace(value, structure.pairOpen, this.printDirective(structureDirective, this.indentLevel(structure.pairOpen)));
                } else {
                    value = StringUtilities.safeReplace(value, structure.pairOpen, this.printDirective(structureDirective, this.indentLevel(structure.pairOpen)));
                    const closeDirective = structureDirective.isClosedBy as DirectiveNode;
                    value = StringUtilities.safeReplace(value, structure.pairClose, this.printDirective(closeDirective, this.indentLevel(structure.pairClose)));
                }
            });
        });

        return value;
    }

    private transformSwitchStatements(content: string): string {
        let value = content;

        this.switchStatements.forEach((switchStatement) => {
            const open = switchStatement.switchNode.constructedFrom as DirectiveNode;

            value = StringUtilities.safeReplace(value, switchStatement.virtualSwitchOpen, this.printDirective(open, this.indentLevel(switchStatement.virtualSwitchOpen)));
            const closeDirective = open.isClosedBy as DirectiveNode;
            value = StringUtilities.safeReplace(value, switchStatement.virtualSwitchClose, closeDirective.sourceContent);

            switchStatement.structures.forEach((structure) => {
                const structureDirective = structure.case.head as DirectiveNode;
                this.removeLines.push(structure.virtualClose);
                this.removeLines.push(structure.virtualOpen);
                if (!structure.isLast) {
                    if (structure.isFirst) {
                        this.removeLines.push(structure.pairClose);
                        value = StringUtilities.safeReplace(value, structure.pairOpen, this.printDirective(structureDirective, this.indentLevel(structure.pairOpen)));
                    } else {
                        this.removeLines.push(structure.pairClose);
                        value = StringUtilities.safeReplace(value, structure.pairOpen, this.printDirective(structureDirective, this.indentLevel(structure.pairOpen)));
                    }
                } else {
                    value = StringUtilities.safeReplace(value, structure.pairOpen, this.printDirective(structureDirective, this.indentLevel(structure.pairOpen)));
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
                if (this.transformOptions.formatDirectivePhpParameters) {
                    if (!this.useLaravelPint) {
                        if (this.phpFormatter != null && directive.hasValidPhp()) {
                            let params = directive.getPhpContent().trim();
                            if (params.startsWith('(') && params.endsWith(')')) {
                                params = params.substring(1);
                                params = params.substring(0, params.length - 1);
                            }
                            let tResult = this.phpFormatter('<?php ' + params, this.transformOptions, null);


                            const arrayParser = new SimpleArrayParser(),
                                array = arrayParser.parse(StringUtilities.safeReplaceAllInString(tResult, "\n", ' ')),
                                targetIndent = this.indentLevel(open);

                            if (arrayParser.getIsAssoc()) {
                                content = '@props' + ' '.repeat(this.transformOptions.spacesAfterDirective) + '(' + tResult + ')';
                            } else {
                                if (array != null) {
                                    tResult = ArrayPrinter.print(array, this.transformOptions.tabSize, 1);

                                    if (targetIndent > 0) {
                                        tResult = StringUtilities.removeEmptyNewLines(IndentLevel.shiftIndent(tResult, targetIndent, true, this.transformOptions));
                                    }

                                    content = '@props' + ' '.repeat(this.transformOptions.spacesAfterDirective) + '(' + tResult + ')';
                                }
                            }
                        }
                    } else {
                        content = this.printDirective(directive, this.indentLevel(open));
                    }
                }
            } catch (err) {
                content = directive.sourceContent;
            }

            value = StringUtilities.safeReplace(value, open, content);
        });

        return value;
    }

    private transformBreaks(content: string): string {
        let value = content;

        this.breakDirectives.forEach((directive, slug) => {
            const close = this.close(slug),
                open = this.open(slug);
            this.removeLines.push(close);

            value = StringUtilities.safeReplace(value, open, directive.sourceContent);
        });

        return value;
    }

    private transformComments(content: string): string {
        let value = content;

        this.inlineComments.forEach((comment, slug) => {
            const open = this.selfClosing(slug);

            value = StringUtilities.safeReplace(value, open, CommentPrinter.printComment(comment, this.transformOptions.tabSize, 0));
        });

        this.htmlTagComments.forEach((comment, slug) => {
            value = StringUtilities.safeReplace(value, slug, CommentPrinter.printComment(comment, this.transformOptions.tabSize, 0));
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

            value = StringUtilities.safeReplace(value, structure.pairOpen, CommentPrinter.printComment(comment, this.transformOptions.tabSize, this.indentLevel(structure.pairOpen)));
            this.removeLines.push(structure.pairClose);
            this.removeLines.push(structure.virtualElement);
        });

        return value;
    }

    private transformDynamicElementForElse(content: string): string {
        let value = content;

        this.dynamicElementForElseNodes.forEach((forElse, slug) => {
            value = StringUtilities.safeReplaceAllInString(value, slug, forElse.nodeContent);
        });

        return value;
    }

    private removeTrailingWhitespaceAfterSubstring(source: string, substring: string): string {
        const lines = StringUtilities.breakByNewLine(source),
            newLines: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.trimRight().endsWith(substring)) {
                newLines.push(line.trimRight());
            } else {
                newLines.push(line);
            }
        }

        return newLines.join("\n");
    }

    private transformDynamicElementConditions(content: string): string {
        let value = content;

        this.dynamicElementConditionNodes.forEach((condition, slug) => {
            if (condition.startPosition?.line != condition.endPosition?.line) {
                let formatContent = condition.nodeContent;

                if (this.transformOptions.useLaravelPint) {
                    formatContent = formatBladeStringWithPint(formatContent, this.formattingOptions, this.transformOptions).trim();
                } else {
                    formatContent = formatBladeString(formatContent, this.formattingOptions).trim();
                }

                const indentLevel = IndentLevel.relativeIndentLevel(slug, value);
        
                formatContent = IndentLevel.indentLast(formatContent, indentLevel, this.transformOptions.tabSize);
                
                value = StringUtilities.safeReplaceAllInString(value, slug, formatContent);
            } else {
                value = this.removeTrailingWhitespaceAfterSubstring(value, slug);
                value = StringUtilities.safeReplaceAllInString(value, slug, condition.nodeContent);
            }
        });

        return value;
    }

    private transformDynamicElementSwitch(content: string): string {
        let value = content;

        this.dynamicElementSwitchNodes.forEach((switchNode, slug) => {
            value = StringUtilities.safeReplaceAllInString(value, slug, switchNode.nodeContent);
        });

        return value;
    }

    private transformDirectiveParameters(content: string): string {
        let value = content;

        this.directiveParameters.forEach((param, slug) => {
            const paramDirective = param.directive as DirectiveNode;

            value = StringUtilities.safeReplace(value, slug, this.printDirective(paramDirective, this.indentLevel(slug)));
        });

        return value;
    }

    private transformExpressionParameters(content: string): string {
        let value = content;

        this.expressionParameters.forEach((param, slug) => {
            let content = param.content;

            if (this.transformOptions.useLaravelPint && this.pintTransformer != null) {
                content = this.pintTransformer.getComponentParameterContent(param);
            }

            if (content.includes("\n")) {
                const relativeIndent = this.indentLevel(slug);

                content = IndentLevel.shiftIndent(
                    content,
                    relativeIndent + this.transformOptions.tabSize,
                    true,
                    this.transformOptions,
                    false,
                    true
                );
            }

            value = StringUtilities.safeReplace(value, slug, content);
        });

        return value;
    }

    private transformEchoParameters(content: string): string {
        let value = content;

        this.echoParameters.forEach((param, slug) => {
            // Handle case of comments.
            if (param.inlineEcho?.sourceContent.startsWith('{{--') && param.inlineEcho.sourceContent.endsWith('--}}')) {
                let commentContent = param.inlineEcho.content.substring(2, param.inlineEcho.content.length - 2);
                value = StringUtilities.safeReplace(value, slug, '{{-- ' + commentContent.trim() + ' --}}');
            }
            if (param.inlineEcho != null) {
                value = StringUtilities.safeReplace(value, slug, EchoPrinter.printEcho(param.inlineEcho, this.transformOptions, this.phpFormatter, 0, this.pintTransformer));
            } else {
                value = StringUtilities.safeReplace(value, slug, '');
            }
        });

        return value;
    }

    private transformEmbeddedEcho(content: string): string {
        let value = content;

        this.embeddedEchos.forEach((echo, slug) => {
            let indentLevel = this.indentLevel(slug);

            if (indentLevel == 0) {
                indentLevel = this.transformOptions.tabSize;
            }
            value = StringUtilities.safeReplace(value, slug, EchoPrinter.printEcho(echo, this.transformOptions, this.phpFormatter, indentLevel, this.pintTransformer));
        });

        this.dynamicAttributeEchoBlocks.forEach((echo, slug) => {
            let indentLevel = this.indentLevel(slug),
                targetReplace = `${slug}="${slug}"`;

            if (indentLevel == 0) {
                indentLevel = this.transformOptions.tabSize;
            }
            value = StringUtilities.safeReplace(value, targetReplace, EchoPrinter.printEcho(echo, this.transformOptions, this.phpFormatter, indentLevel, this.pintTransformer));
        });

        return value;
    }

    private transformEmbeddedDirectives(content: string): string {
        let value = content;

        this.embeddedDirectives.forEach((directive, slug) => {
            let targetIndent = this.indentLevel(slug);

            if (targetIndent == 0 && directive.sourceContent.includes("\n")) {
                targetIndent = IndentLevel.relativeIndentLevel(slug, value) + (2 * this.transformOptions.tabSize);
            }

            value = StringUtilities.safeReplace(value, slug, this.printDirective(directive, targetIndent));
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

            if (indent == this.transformOptions.tabSize) {
                indent = 0;
            }

            if (value.includes(target)) {
                value = StringUtilities.safeReplace(value, target, IndentLevel.indentRelative(document.content, indent, this.transformOptions.tabSize));
            }
        });

        return value;
    }

    private removeVirtualStructures(content: string): string {
        let value = content;

        this.removeLines.forEach((line) => {
            value = StringUtilities.safeReplace(value, line, '');
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
                        newLine = StringUtilities.safeReplace(newLine, line, '');
                    }
                });
                newLines.push(newLine);
            }
        }

        return newLines.join("\n");
    }

    private reflowSlugs(content: string): string {
        let result = content;
        const rLines = StringUtilities.breakByNewLine(result);
        const newLines: string[] = [];

        for (let i = 0; i < rLines.length; i++) {
            const rLine = rLines[i].trimRight();
            let added = false;
            for (let j = 0; j < this.slugs.length; j++) {
                const slug = this.slugs[j];
                if (rLine.endsWith('<' + slug) && i + 1 < rLines.length) {
                    const nLine = rLines[i + 1];

                    if (nLine.trimLeft().startsWith('/>')) {
                        const breakOn = nLine.indexOf('/>');
                        const nLineAfter = nLine.substring(breakOn + 2);
                        newLines.push(rLine.trimRight() + ' />');
                        const reflowCount = rLine.indexOf('<' + slug);
                        newLines.push(' '.repeat(reflowCount) + nLineAfter.trimLeft());
                        i += 1;
                        added = true;
                        break;
                    }
                }
            }
            if (!added) {
                newLines.push(rLine);
            }
        }

        result = newLines.join("\n");

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

    private transformRemovedAttibutes(content: string): string {
        let result = content;

        this.removedAttributes.forEach((attribute, slug) => {
            const attributeResult = formatExtractedScript(attribute, this.transformOptions, slug, result, this, this.doc);
            result = StringUtilities.safeReplace(result, '"' + slug + '"', attributeResult)
        });

        return result;
    }

    fromStructure(content: string) {
        if (this.didPintFail) {
            if (this.shadowDoc != null) {
                return this.shadowDoc.getContent();
            }

            return this.doc.getContent();
        }

        const reflowedContent = this.reflowSlugs(content);

        this.structureLines = StringUtilities.breakByNewLine(reflowedContent);

        // Dynamic blocks might be hiding some attributes. We need to restore
        // those first before transforming the removed attributes safely.
        let results = this.transformDynamicElementConditions(reflowedContent);
        results = this.transformDynamicEcho(results);
        results = this.transformDynamicElementForElse(results);
        results = this.transformDynamicElementSwitch(results);
        results = this.transformDynamicDirectives(results);

        results = this.transformRemovedAttibutes(results);

        if (this.parentTransformer == null && VoidHtmlTagsManager.voidTagMapping.size > 0) {
            VoidHtmlTagsManager.voidTagMapping.forEach((htmlTag, slug) => {
                results = StringUtilities.safeReplaceAllInString(results, slug, htmlTag);
            });
        }

        return this.transformStructures(results);
    }

    transformStructures(content: string) {
        let results = content;

        results = this.transformInlineDirectives(results);
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
        results = this.transformEchoParameters(results);
        results = this.transformDynamicDirectives(results);
        results = this.cleanVirtualStructures(results);
        results = this.removeVirtualStructures(results);
        results = this.transformEmbeddedEcho(results);
        results = this.transformEmbeddedDirectives(results);
        results = this.transformExtractedDocuments(results);
        results = this.transformPhpBlock(results);
        results = this.transformComponentSlots(results);

        if (this.ignoredLiteralBlocks.size > 0) {
            this.ignoredLiteralBlocks.forEach((nodes, slug) => {
                const replace = this.selfClosing(slug);

                results = StringUtilities.safeReplace(results, replace, this.dumpPreservedNodes(nodes));
            });

            if (this.removedAttributes.size > 0) {
                this.removedAttributes.forEach((attribute, slug) => {
                    const contentToInsert = attribute.content.substring(1, attribute.content.length - 1);

                    results = StringUtilities.safeReplace(results, slug, contentToInsert);
                });
            }
        }

        return results;
    }

    private dumpPreservedNodes(nodes: AbstractNode[]): string {
        let stringResults = '';

        nodes.forEach((node) => {
            if (node instanceof LiteralNode) {
                stringResults += node.content;
            } else if (node instanceof SwitchStatementNode) {
                stringResults += node.nodeContent;
            } else if (node instanceof ConditionNode) {
                stringResults += node.nodeContent;
            } else if (node instanceof DirectiveNode) {
                stringResults += node.sourceContent;
            } else if (node instanceof BladeEchoNode) {
                stringResults += node.sourceContent;
            } else if (node instanceof ForElseNode) {
                stringResults += node.nodeContent;
            } else if (node instanceof BladeCommentNode) {
                stringResults += node.sourceContent;
            } else if (node instanceof BladeComponentNode) {
                stringResults += node.sourceContent;
            } else if (node instanceof InlinePhpNode) {
                stringResults += node.sourceContent;
            }
        });

        return stringResults;
    }
}