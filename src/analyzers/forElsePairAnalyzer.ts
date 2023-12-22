import { BladeDocument } from '../document/bladeDocument.js';
import { getStartPosition } from '../nodes/helpers.js';
import { AbstractNode, DirectiveNode, ForElseNode } from '../nodes/nodes.js';
import { BladeKeywords } from '../parser/bladeKeywords.js';
import { DocumentParser } from '../parser/documentParser.js';

export class ForElsePairAnalyzer {
    static associate(nodes: AbstractNode[], document: DocumentParser) {
        const reduced: AbstractNode[] = [];

        nodes.forEach((node) => {
            if (node instanceof DirectiveNode && node.name.toLowerCase() == BladeKeywords.ForElse && node.directiveName.toLowerCase() != BladeKeywords.EndForElse) {
                reduced.push(this.createForElseNode(node, document));
            } else {
                reduced.push(node);
            }
        });

        return reduced;
    }

    private static createForElseNode(node: DirectiveNode, parser: DocumentParser) {
        const forElseNode = new ForElseNode();
        forElseNode.withParser(parser);
        forElseNode.originalNode = node;
        forElseNode.startPosition = node.startPosition;
        forElseNode.endPosition = node.getFinalClosingDirective().endPosition;
        forElseNode.constructedFrom = node;

        const elseNode = node.findFirstDirectChildDirectiveOfType('empty');

        if (elseNode == null) {
            forElseNode.tailNode = node.children.pop() as DirectiveNode;
            forElseNode.truthNodes = node.children;

            const truthStart = (node.startPosition?.index ?? 0) - 1,
                truthEnd = (node.isClosedBy?.startPosition?.index ?? 0) - 1,
                truthLength = truthEnd - truthStart,
                truthInnerStart = (node.endPosition?.index ?? 0) + 1,
                truthInnerEnd = (node.isClosedBy?.startPosition?.index ?? 0) - 1,
                truthInnerLength = truthInnerEnd - truthInnerStart;
            forElseNode.truthDocumentContent = parser.getText(truthStart, truthEnd);
            forElseNode.truthDocumentOffset = {
                start: truthStart,
                end: truthEnd,
                length: truthLength
            };

            forElseNode.truthInnerContent = parser.getText(truthInnerStart, truthInnerEnd);
            forElseNode.truthInnerOffset = {
                start: truthInnerStart,
                end: truthInnerEnd,
                length: truthInnerLength
            };
        } else {
            const children = node.children,
                truthNodes: AbstractNode[] = [];
            let falseNodes: AbstractNode[] = [];
            forElseNode.elseNode = elseNode;

            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                if (child.refId == elseNode.refId) {
                    falseNodes = children.slice(i + 1);
                    break;
                } else {
                    truthNodes.push(child);
                }
            }

            forElseNode.truthNodes = truthNodes;

            if (falseNodes.length > 0) {
                forElseNode.tailNode = falseNodes.pop() as DirectiveNode;
            }

            forElseNode.falseNodes = falseNodes;

            const truthStart = (node.startPosition?.index ?? 0) - 1,
                truthEnd = (elseNode.startPosition?.index ?? 0) - 1,
                truthLength = truthEnd - truthStart,
                truthInnerStart = (node.endPosition?.index ?? 0) + 1,
                truthInnerEnd = (elseNode.startPosition?.index ?? 0) - 1,
                truthInnerLength = truthInnerEnd - truthInnerStart;
            forElseNode.truthDocumentContent = parser.getText(truthStart, truthEnd);
            forElseNode.truthDocumentOffset = {
                start: truthStart,
                end: truthEnd,
                length: truthLength
            };

            forElseNode.truthInnerContent = parser.getText(truthInnerStart, truthInnerEnd);
            forElseNode.truthInnerOffset = {
                start: truthInnerStart,
                end: truthInnerEnd,
                length: truthInnerLength
            };

            const falseStart = (elseNode.startPosition?.index ?? 0) - 1,
                falseEnd = (node.isClosedBy?.startPosition?.index ?? 0) - 1,
                falseLength = falseEnd - falseStart,
                falseInnerStart = (elseNode.endPosition?.index ?? 0) + 1,
                falseInnerEnd = (node.isClosedBy?.startPosition?.index ?? 0) - 1,
                falseInnerLength = falseInnerEnd - falseInnerStart;
            forElseNode.falseDocumentContent = parser.getText(falseStart, falseEnd);
            forElseNode.falseDocumentOffset = {
                start: falseStart,
                end: falseEnd,
                length: falseLength
            };

            forElseNode.falseInnerContent = parser.getText(falseInnerStart, falseInnerEnd);
            forElseNode.falseInnerOffset = {
                start: falseInnerStart,
                end: falseInnerEnd,
                length: falseInnerLength
            };
        }

        forElseNode.truthDocument = BladeDocument.childFromText(parser.getNodeText(forElseNode.truthNodes), parser, getStartPosition(forElseNode.truthNodes));
        forElseNode.falseDocument = BladeDocument.childFromText(parser.getNodeText(forElseNode.falseNodes), parser, getStartPosition(forElseNode.falseNodes));

        const forElseStart = (node.startPosition?.index ?? 0) - 1,
            forElseEnd = node.isClosedBy?.endPosition?.index ?? 0 - (node.startPosition?.index ?? 0),
            forElseLength = forElseEnd - forElseStart;
        forElseNode.nodeContent = parser.getText(forElseStart, forElseEnd);
        forElseNode.documentContent = parser.getText(forElseStart, forElseEnd);
        forElseNode.offset = {
            start: forElseStart,
            end: forElseEnd,
            length: forElseLength
        };

        return forElseNode;
    }
}