import { DocumentParser } from '../parser/documentParser';
import { Position, Range } from './position';
import { v4 as uuidv4 } from 'uuid';
import { StringUtilities } from '../utilities/stringUtilities';
import { BladeDocument } from '../document/bladeDocument';
import { Offset } from './offset';
import { BladeError } from '../errors/bladeError';

function newRefId() {
    return StringUtilities.replaceAllInString(uuidv4(), '-', '_');
}

export enum FragmentPosition {
    IsDynamicFragmentName,
    InsideFragmentParameter,
    InsideFragment,
    Unresolved
}

export class FragmentNode {
    public startPosition: Position | null = null;
    public endPosition: Position | null = null;
    public index = 0;
    public embeddedIndex = 0;
    public refId: string | null = null;
    public parameters: FragmentParameterNode[] = [];
    public isSelfClosing = false;
    public isClosingFragment = false;
    public name = '';
    public containsStructures = false;

    constructor() {
        this.refId = newRefId();
    }
}

export interface StructuralFragment {
    start: FragmentNode,
    end: FragmentNode
}

export class FragmentParameterNode {
    public startPosition: Position | null = null;
    public endPosition: Position | null = null;
}

export class AbstractNode {
    protected parser: DocumentParser | null = null;
    public refId: string | null = null;
    public startPosition: Position | null = null;
    public endPosition: Position | null = null;
    public sourceContent = '';
    public index = 0;
    public parentIndex = -1;
    public parentTypeIndex = -1;
    public parent: AbstractNode | null = null;
    public originalAbstractNode: AbstractNode | null = null;
    public fragment: FragmentNode | null = null;
    public fragmentPosition: FragmentPosition = FragmentPosition.Unresolved;
    public containsAnyFragments = false;
    public containsChildStructures = false;
    public offset: Offset | null = null;
    public errors: BladeError[] = [];

    public isInScriptTag = false;
    public isInStyleTag = false;

    isEmbedded(): boolean {
        return this.isInScriptTag || this.isInStyleTag;
    }

    public prevNode: AbstractNode | null = null;
    public nextNode: AbstractNode | null = null;

    constructor() {
        this.refId = newRefId();
    }

    getErrors(): BladeError[] {
        return this.errors;
    }

    pushError(error: BladeError) {
        if (this.parent != null) {
            this.parent.pushError(error);
        } else {
            if (this.parser != null) {
                this.parser.pushError(error);
            }
        }

        this.errors.push(error);
    }

    relativeOffset(offset: number): number {
        return offset + (this.startPosition?.index ?? 0);
    }

    withParser(parser: DocumentParser) {
        this.parser = parser;

        return this;
    }

    getParser() {
        return this.parser;
    }
}

export enum ParameterType {
    Parameter,
    Directive,
    Attribute,
    InlineEcho
}

export class ParameterNode extends AbstractNode {
    public name = '';
    public realName = '';
    public value = '';
    public terminatorStyle = '"';
    public wrappedValue = '';
    public content = '';
    public type: ParameterType = ParameterType.Parameter;
    public directive: DirectiveNode | null = null;
    public inlineEcho: BladeEchoNode | null = null;

    public namePosition: Range | null = null;
    public valuePosition: Range | null = null;

    public isEscapedExpression = false;
    public isExpression = false;
}

export class ComponentNameNode extends AbstractNode {
    public name = '';
    public inlineName = '';
}

export class BladeComponentNode extends AbstractNode {
    public name: ComponentNameNode | null = null;
    public isClosingTag = false;
    public isSelfClosing = false;
    public innerContent = '';
    public parameterContent = '';

    public receivesAttributeBag = false;
    public hasParameters = false;
    public parameters: ParameterNode[] = [];

    getComponentName(): string {
        if (this.name == null) {
            return '';
        }

        let name = this.name.name.trim();

        if (this.name.inlineName.trim().length > 0) {
            name += ':' + this.name.inlineName.trim();
        }

        return name;
    }

    hasParameter(name: string): boolean {
        for (let i = 0; i < this.parameters.length; i++) {
            if (this.parameters[i].realName == name) {
                return true;
            }
        }

        return false;
    }

    getParameter(name: string): ParameterNode | null {
        for (let i = 0; i < this.parameters.length; i++) {
            if (this.parameters[i].realName == name) {
                return this.parameters[i];
            }
        }

        return null;
    }

    getParametersExcept(parameters: string[]): ParameterNode[] {
        return this.parameters.filter((param) => {
            return !parameters.includes(param.realName);
        });
    }
}

export class LiteralNode extends AbstractNode {
    public content = '';

    getOutputContent() {
        let content = StringUtilities.replaceAllInString(this.content, '@{', '{');
        content = StringUtilities.replaceAllInString(content, '@@', '@');

        return content;
    }
}

export class BladeCommentNode extends AbstractNode {
    public innerContentPosition: Range | null = null;
    public innerContent = '';

    isMultiline(): boolean {
        return this.sourceContent.includes("\n");
    }
}

export class InlinePhpNode extends AbstractNode {
    private cachedHasValidPhp: boolean | null = null;
    private cachedPhpLastError: SyntaxError | null = null;

    public isInline = false;

    hasValidPhp() {
        if (this.cachedHasValidPhp == null) {
            const validator = this.getParser()?.getPhpValidator();

            if (validator != null) {
                this.cachedHasValidPhp = validator.isValid(this.sourceContent, false);
                this.cachedPhpLastError = validator.getLastError();
            } else {
                this.cachedHasValidPhp = false;
            }
        }

        return this.cachedHasValidPhp as boolean;
    }

    getPhpError(): SyntaxError | null {
        return this.cachedPhpLastError;
    }
}

export class ShorthandInlinePhpNode extends InlinePhpNode { }

export class DirectiveNode extends AbstractNode {
    public name = '';
    public directiveName = '';
    public namePosition: Range | null = null;
    public hasDirectiveParameters = false;
    public directiveParameters = '';
    public directiveParametersPosition: Range | null = null;
    public children: AbstractNode[] = [];
    public childrenDocument: ChildDocument | null = null;
    public childTypeCounts: Map<string, number> = new Map();
    public _conditionParserAbandonPairing = false;
    public hasJsonParameters = false;
    public ref = 0;

    public isClosedBy: DirectiveNode | null = null;
    public isOpenedBy: DirectiveNode | null = null;

    public isClosingDirective = false;

    public innerContent = '';
    public documentContent = '';
    public nodeContent = '';

    private cachedHasValidJson: boolean | null = null;

    private cachedHasValidPhp: boolean | null = null;
    private cachedPhpLastError: SyntaxError | null = null;

    hasValidJson() {
        if (this.hasJsonParameters == false) {
            this.cachedHasValidJson = false;
        }

        if (this.cachedHasValidJson == null) {
            try {
                let params = this.getPhpContent().trim();
                if (params.startsWith('(') && params.endsWith(')')) {
                    params = params.substring(1);
                    params = params.substring(0, params.length - 1);
                }
                JSON.parse(params);
                this.cachedHasValidJson = true;
            } catch (err) {
                this.cachedHasValidJson = false;
            }
        }

        return this.cachedHasValidJson as boolean;
    }

    hasValidPhp() {
        if (this.hasJsonParameters) {
            this.cachedHasValidPhp = false;
        }

        if (this.cachedHasValidPhp == null) {            
            const validator = this.getParser()?.getPhpValidator();

            if (validator != null) {
                this.cachedHasValidPhp = validator.isValid(this.getPhpContent(), true);
                this.cachedPhpLastError = validator.getLastError();
            } else {
                this.cachedHasValidPhp = false;
            }
        }

        return this.cachedHasValidPhp as boolean;
    }

    getPhpError(): SyntaxError | null {
        return this.cachedPhpLastError;
    }

    isFirstOfType(): boolean {
        return this.parentTypeIndex == 1;
    }

    hasInnerExpression(): boolean {
        if (!this.hasDirectiveParameters) { return false; }

        return this.getInnerContent().length > 0;
    }

    getInnerContent(): string {
        let params = this.directiveParameters.trim().substring(1);

        params = params.substring(0, params.length - 1);

        return params;
    }

    getImmediateChildren(): AbstractNode[] {
        const immediateChildren: AbstractNode[] = [];

        for (let i = 0; i < this.children.length; i++) {
            const node = this.children[i];

            if (node.parent?.refId == this.refId) {
                if (node == this.isClosedBy) { break; }
                immediateChildren.push(node);
            }
        }

        return immediateChildren;
    }

    getPhpContent() {
        if (this.directiveName.toLowerCase() == 'forelse') {
            return 'foreach (' + this.getInnerContent() + '):endforeach;';
        }

        return this.directiveParameters;
    }

    getChildren(): AbstractNode[] {
        if (this.isClosedBy == null) { return []; }

        const newChildren: AbstractNode[] = [];

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            if (child instanceof DirectiveNode && child.refId == this.isClosedBy.refId) { break; }
            newChildren.push(child);
        }

        return newChildren;
    }

    hasChildDirectiveOfType(name: string): boolean {
        const ofType = this.findFirstChildDirectiveOfType(name);

        return ofType != null;
    }

    findFirstChildDirectiveOfType(name: string): DirectiveNode | null {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            if (child instanceof DirectiveNode && child.directiveName == name) {
                return child;
            }
        }

        return null;
    }

    findFirstDirectChildDirectiveOfType(name: string): DirectiveNode | null {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            if (child instanceof DirectiveNode && child.directiveName == name) {
                if (child.parent != null && child.parent.refId == this.refId) {
                    return child;
                }
            }
        }

        return null;
    }

    findDirectivesOfType(name: string): DirectiveNode[] {
        const directives: DirectiveNode[] = [];

        this.children.forEach((node) => {
            if (node instanceof DirectiveNode && node.directiveName == name) {
                directives.push(node);
            }
        });

        return directives;
    }

    findDirectChildDirectivesOfType(name: string): DirectiveNode[] {
        const directives: DirectiveNode[] = [];

        this.children.forEach((node) => {
            if (node instanceof DirectiveNode && node.directiveName == name) {
                if (node.parent != null && node.parent.refId == this.refId) {
                    directives.push(node);
                }
            }
        });

        return directives;
    }

    clone(): DirectiveNode {
        const clone = new DirectiveNode();
        clone.children = [...this.children];
        clone.directiveName = this.directiveName;
        clone.directiveParameters = this.directiveParameters;
        clone.directiveParametersPosition = this.directiveParametersPosition;
        clone.documentContent = this.documentContent;
        clone.endPosition = this.endPosition;
        clone.hasDirectiveParameters = this.hasDirectiveParameters;
        clone.index = this.index;
        clone.innerContent = this.innerContent;
        clone.isClosedBy = this.isClosedBy;
        clone.isClosingDirective = this.isClosingDirective;
        clone.isOpenedBy = this.isOpenedBy;
        clone.name = this.name;
        clone.namePosition = this.namePosition;
        clone.parent = this.parent;
        clone.refId = this.refId;
        clone.sourceContent = this.sourceContent;
        clone.startPosition = this.startPosition;

        const parser = this.getParser();

        if (parser != null) { clone.withParser(parser); }


        clone.originalAbstractNode = this;
        clone.containsAnyFragments = this.containsAnyFragments;
        clone.containsChildStructures = this.containsChildStructures;
        clone.isInScriptTag = this.isInScriptTag;
        clone.isInStyleTag = this.isInStyleTag;

        return clone;
    }

    getFinalClosingDirective(): DirectiveNode {
        if (this.isClosedBy == null) { return this; }

        return this.isClosedBy.getFinalClosingDirective();
    }
}

export class ExecutionBranchNode extends AbstractNode {
    public head: DirectiveNode | null = null;
    public tail: DirectiveNode | null = null;
    public nodes: AbstractNode[] = [];

    public childDocument: ChildDocument | null = null;

    public documentContent = '';
    public innerContent = '';
    public innerOffset: Offset | null = null;
}

export class ConditionNode extends DirectiveNode {
    public constructedFrom: AbstractNode | null = null;
    public nodeContent = '';
    public logicBranches: ExecutionBranchNode[] = [];
    public chain: number[] = [];

    getParent(): DirectiveNode | null {
        if (this.logicBranches.length > 0) {
            if (this.logicBranches[0].head != null) {
                if (this.logicBranches[0].head.parent != null && this.logicBranches[0].head.parent instanceof DirectiveNode) {
                    return this.logicBranches[0].head.parent;
                }
            }
        }

        return null;
    }
}

export class SwitchStatementNode extends AbstractNode {
    public constructedFrom: AbstractNode | null = null;
    public nodeContent = '';
    public originalNode: DirectiveNode | null = null;
    public tail: DirectiveNode | null = null;
    public cases: SwitchCaseNode[] = [];
}

export class SwitchCaseNode extends AbstractNode {
    public order = 0;
    public leadingNodes: AbstractNode[] = [];
    public leadingDocument: ChildDocument | null = null;
    public head: DirectiveNode | null = null;
    public children: AbstractNode[] = [];
    public isDefault = false;
    public isClosedBy: DirectiveNode | null = null;
    public childDocument: ChildDocument | null = null;
    public documentContent = '';
    public innerContent = '';
    public innerOffset: Offset | null = null;
}

export class ForElseNode extends AbstractNode {
    public constructedFrom: AbstractNode | null = null;
    public nodeContent = '';
    public originalNode: DirectiveNode | null = null;
    public truthNodes: AbstractNode[] = [];
    public elseNode: DirectiveNode | null = null;
    public falseNodes: AbstractNode[] = [];
    public tailNode: DirectiveNode | null = null;

    public truthDocument: ChildDocument | null = null;
    public falseDocument: ChildDocument | null = null;

    public documentContent = '';

    public truthDocumentContent = '';
    public truthInnerContent = '';
    public truthDocumentOffset: Offset | null = null;
    public truthInnerOffset: Offset | null = null;

    public falseDocumentContent = '';
    public falseInnerContent = '';
    public falseDocumentOffset: Offset | null = null;
    public falseInnerOffset: Offset | null = null;
}

export class BladeEchoNode extends AbstractNode {
    public content = '';

    private cachedHasValidPhp: boolean | null = null;
    private cachedPhpLastError: SyntaxError | null = null;
    public isInlineEcho = false;

    hasValidPhp() {
        if (this.cachedHasValidPhp == null) {
            const validator = this.getParser()?.getPhpValidator();

            if (validator != null) {
                this.cachedHasValidPhp = validator.isValid(this.content, true);
                this.cachedPhpLastError = validator.getLastError();
            } else {
                this.cachedHasValidPhp = false;
            }
        }

        return this.cachedHasValidPhp as boolean;
    }

    getPhpError(): SyntaxError | null {
        return this.cachedPhpLastError;
    }
}

export class BladeEscapedEchoNode extends BladeEchoNode { }
export class BladeEntitiesEchoNode extends BladeEchoNode { }

export class BladePhpNode extends AbstractNode { }
export class BladeStaticNode extends AbstractNode { }
export class BladeVerbatimNode extends AbstractNode { }
export class OperatorNode extends AbstractNode { }
export class ArrayStartNode extends AbstractNode {
    public tokenLength = 0;
}
export class ArrayEndNode extends AbstractNode { }
export class ArrayElementSeparatorNode extends AbstractNode { }
export class ArrayKeyValueNode extends AbstractNode { }
export class ArrayElementNode extends AbstractNode {
    public key: AbstractNode | null = null;
    public value: AbstractNode | null = null;
    public isLast = false;
}
export class ArrayNode extends AbstractNode {
    public elements: ArrayElementNode[] = [];
    public containsKeys = false;
    public maxKeyLength = 0;
}

export interface ChildDocument {
    renderNodes: AbstractNode[],
    content: string,
    document: BladeDocument
}