import { BladeDocument } from '../document/bladeDocument.js';
import { getStartPosition } from '../nodes/helpers.js';
import { AbstractNode, DirectiveNode, SwitchCaseNode, SwitchStatementNode } from '../nodes/nodes.js';
import { BladeKeywords } from '../parser/bladeKeywords.js';
import { DocumentParser } from '../parser/documentParser.js';

export class SwitchPairAnalyzer {
    static associate(nodes: AbstractNode[], document: DocumentParser) {
        const reduced: AbstractNode[] = [];

        nodes.forEach((node) => {
            if (node instanceof DirectiveNode && node.directiveName.toLowerCase() == BladeKeywords.Switch) {
                reduced.push(this.createSwitchNode(node, document));
            } else {
                reduced.push(node);
            }
        });

        return reduced;
    }

    private static createSwitchNode(node: DirectiveNode, parser: DocumentParser): SwitchStatementNode {
        const switchNode = new SwitchStatementNode(),
            children = node.children;
        switchNode.originalNode = node;
        switchNode.startPosition = node.startPosition;
        switchNode.endPosition = node.getFinalClosingDirective().endPosition;
        switchNode.parent = node.parent;
        switchNode.withParser(parser);
        switchNode.constructedFrom = node;

        let currentNodes: AbstractNode[] = [];

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child instanceof DirectiveNode && child.name == BladeKeywords.Switch) {
                // Skip this for now. We will handle this with the child document.
                i += child.children.length;
            }

            if (child instanceof DirectiveNode && child.name == BladeKeywords.Case) {
                const caseChildren = this.collectUntil(node, children.slice(i + 1), [BladeKeywords.Case, BladeKeywords.Default, BladeKeywords.EndSwitch]),
                    switchCase = new SwitchCaseNode();

                switchCase.parent = child.parent;

                if (switchNode.cases.length == 0 && currentNodes.length > 0) {
                    switchCase.leadingNodes = currentNodes;

                    if (currentNodes.length > 0) {
                        const firstNode = currentNodes[0] as AbstractNode,
                            lastNode = currentNodes[currentNodes.length - 1] as AbstractNode,
                            start = firstNode.startPosition?.index ?? 0,
                            end = (lastNode.endPosition?.index ?? 0) + 1,
                            childText = parser.getText(start, end);

                        switchCase.leadingDocument = BladeDocument.childFromText(childText, parser, firstNode.startPosition);
                    }

                    currentNodes = [];
                }

                switchCase.refId = child.refId;
                switchCase.index = child.index;
                switchCase.startPosition = child.startPosition;
                switchCase.endPosition = child.endPosition;
                switchCase.order = switchNode.cases.length;
                switchCase.head = child;
                switchCase.isDefault = false;
                switchCase.children = caseChildren.children;
                switchCase.withParser(parser);
                switchCase.isClosedBy = caseChildren.brokeOn;
                child.isClosedBy = caseChildren.brokeOn;

                if (switchCase.children.length > 0) {
                    const lastChild = switchCase.children[switchCase.children.length - 1];

                    if (lastChild instanceof DirectiveNode && lastChild == node.isClosedBy) {
                        switchCase.children.pop();
                    }
                }

                switchCase.childDocument = BladeDocument.childFromText(parser.getNodeText(switchCase.children), parser, getStartPosition(switchCase.children));

                if (caseChildren.brokeOn != null) {
                    switchCase.endPosition = caseChildren.brokeOn.startPosition;
                }

                const caseStart = (switchCase.startPosition?.index ?? 0) - 1,
                    caseEnd = (switchCase.isClosedBy?.startPosition?.index ?? 0) - 1,
                    length = caseEnd - caseStart,
                    caseInnerStart = (child.endPosition?.index ?? 0) + 1,
                    caseInnerEnd = (switchCase.isClosedBy?.startPosition?.index ?? 0) - 1,
                    innerLength = caseInnerEnd - caseInnerStart;

                switchCase.documentContent = parser.getText(caseStart, caseEnd);
                switchCase.innerContent = parser.getText(caseInnerStart, caseInnerEnd);
                switchCase.offset = {
                    start: caseStart,
                    end: caseEnd,
                    length: length
                };
                switchCase.innerOffset = {
                    start: caseInnerStart,
                    end: caseInnerEnd,
                    length: innerLength
                };

                switchNode.cases.push(switchCase);
            } else if (child instanceof DirectiveNode && child.name == BladeKeywords.Default) {
                const caseChildren = children.slice(i + 1),
                    defaultCase = new SwitchCaseNode();

                defaultCase.parent = child.parent;
                defaultCase.refId = child.refId;
                defaultCase.index = child.index;
                defaultCase.startPosition = child.startPosition;
                defaultCase.endPosition = node.startPosition;
                defaultCase.order = switchNode.cases.length;
                defaultCase.head = child;
                defaultCase.isDefault = true;
                defaultCase.children = caseChildren;
                defaultCase.withParser(parser);
                defaultCase.isClosedBy = node.isClosedBy;
                child.isClosedBy = node.isClosedBy;

                const childDocNodes = [...defaultCase.children],
                    lastChild = childDocNodes[childDocNodes.length - 1];

                if (lastChild instanceof DirectiveNode && lastChild.refId == node.isClosedBy?.refId) {
                    childDocNodes.pop();
                }

                const caseStart = (defaultCase.startPosition?.index ?? 0) - 1,
                    caseEnd = (defaultCase.isClosedBy?.startPosition?.index ?? 0) - 1,
                    length = caseEnd - caseStart,
                    caseInnerStart = (child.endPosition?.index ?? 0) + 1,
                    caseInnerEnd = (defaultCase.isClosedBy?.startPosition?.index ?? 0) - 1,
                    innerLength = caseInnerEnd - caseInnerStart;

                defaultCase.documentContent = parser.getText(caseStart, caseEnd);
                defaultCase.innerContent = parser.getText(caseInnerStart, caseInnerEnd);
                defaultCase.offset = {
                    start: caseStart,
                    end: caseEnd,
                    length: length
                };
                defaultCase.innerOffset = {
                    start: caseInnerStart,
                    end: caseInnerEnd,
                    length: innerLength
                };

                defaultCase.childDocument = BladeDocument.childFromText(parser.getNodeText(childDocNodes), parser, getStartPosition(childDocNodes));

                switchNode.cases.push(defaultCase);
                break;
            } else {
                currentNodes.push(child);
            }
        }

        if (switchNode.cases.length > 0) {
            const lastChild = switchNode.cases[switchNode.cases.length - 1];

            if (lastChild.children.length > 0) {
                switchNode.tail = lastChild.children.pop() as DirectiveNode;
            }
        }

        if (switchNode.cases.length == 0) {
            // Set child doc on the construction.
            const childDocNodes = [...node.children];

            if (childDocNodes.length > 0) {
                if (childDocNodes[childDocNodes.length - 1] == node.isClosedBy) {
                    childDocNodes.pop();
                }
            }

            node.childrenDocument = BladeDocument.childFromText(parser.getNodeText(childDocNodes), parser, getStartPosition(childDocNodes));
        }

        const switchStartOffset = (node.startPosition?.index ?? 0) - 1,
            switchLength = node.isClosedBy?.endPosition?.index ?? 0 - (node.startPosition?.index ?? 0),
            switchEndOffset = switchStartOffset + switchLength;

        switchNode.nodeContent = parser.getText(switchStartOffset, switchLength);
        switchNode.offset = {
            start: switchStartOffset,
            end: switchEndOffset,
            length: switchLength
        };

        if (switchNode.cases.length > 0) {
            const lastCase = switchNode.cases[switchNode.cases.length - 1] as SwitchCaseNode;

            if (lastCase.isClosedBy == null) {
                lastCase.isClosedBy = node.isClosedBy;
            }
        }

        return switchNode;
    }

    private static collectUntil(reference: DirectiveNode, children: AbstractNode[], breakFor: string[]): CollectResults {
        const childrenToReturn: AbstractNode[] = [];
        let brokeOn: DirectiveNode | null = null;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child instanceof DirectiveNode && breakFor.includes(child.name) && child.parent?.refId == reference.refId) {
                brokeOn = child;
                break;
            }
            childrenToReturn.push(child);
        }

        return {
            children: childrenToReturn,
            brokeOn: brokeOn
        };
    }
}

interface CollectResults {
    children: AbstractNode[],
    brokeOn: DirectiveNode | null
}