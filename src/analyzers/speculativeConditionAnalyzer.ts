import { BladeDocument } from '../document/bladeDocument';
import { getStartPosition } from '../nodes/helpers';
import { AbstractNode, ConditionNode, DirectiveNode, ExecutionBranchNode } from '../nodes/nodes';
import { DocumentParser } from '../parser/documentParser';
import { PairManager } from './pairManager';

export class SpeculativeConditionAnalyzer {
    static analyze(nodes: AbstractNode[], document: DocumentParser) {
        const reduced: AbstractNode[] = [];

        nodes.forEach((node) => {
            if (node instanceof DirectiveNode && node.isClosedBy != null) {
                const elseNode = node.findFirstChildDirectiveOfType('else');

                if (elseNode != null && elseNode.isClosedBy == null) {
                    reduced.push(this.convertToConditionalNode(node, elseNode, document));
                } else {
                    reduced.push(node);
                }
            } else {
                reduced.push(node);
            }
        });

        return reduced;
    }

    private static convertToConditionalNode(node: DirectiveNode, elseNode: DirectiveNode, document: DocumentParser): ConditionNode {
        const condition = new ConditionNode(),
            finalClosing = node.getFinalClosingDirective(),
            children = node.children,
            branchOneNodes: AbstractNode[] = [];
        let branchTwoNodes: AbstractNode[] = [];
        const tail = children.pop() as DirectiveNode;
        condition.withParser(document);
        condition.parent = node.parent;
        condition.startPosition = node.startPosition;
        condition.endPosition = finalClosing.endPosition;
        condition.constructedFrom = node;

        const startOffset = (node.startPosition?.index ?? 0) - 1,
            length = finalClosing?.endPosition?.index ?? 0 - (node.startPosition?.index ?? 0),
            endOffset = startOffset + length;

        condition.nodeContent = document.getText(startOffset, length);
        condition.offset = {
            start: startOffset,
            end: endOffset,
            length: length
        };

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child instanceof DirectiveNode && child.refId == elseNode.refId) {
                branchTwoNodes = children.slice(i + 1);
                break;
            } else {
                branchOneNodes.push(child);
            }
        }

        const branchOne = new ExecutionBranchNode(),
            branchTwo = new ExecutionBranchNode();

        branchOne.withParser(document);
        branchTwo.withParser(document);

        node.isClosedBy = elseNode;
        elseNode.isOpenedBy = node;
        tail.isOpenedBy = elseNode;
        elseNode.isClosedBy = tail;

        const branchOneChildDocNodes = [...branchOneNodes],
            branchTwoChildDocNodes = [...branchTwoNodes];

        branchOneNodes.push(elseNode);

        branchOne.head = node;
        branchOne.nodes = branchOneNodes;
        branchOne.index = node.index;

        const branchOneStart = (node.endPosition?.index ?? 0),
            branchOneEnd = (node.isClosedBy?.startPosition?.index ?? 0) - 1,
            branchOneLength = branchOneEnd - branchOneStart,
            branchOneDocStart = (node.startPosition?.index ?? 0) - 1,
            branchOneDocEnd = (node.isClosedBy?.startPosition?.index ?? 0) - 1,
            branchOneDocLength = branchOneDocEnd - branchOneDocStart;

        branchOne.innerContent = document.getText(branchOneStart, branchOneEnd);
        branchOne.documentContent = document.getText(branchOneDocStart, branchOneDocEnd);
        branchOne.innerOffset = {
            start: branchOneStart,
            end: branchOneEnd,
            length: branchOneLength
        };
        branchOne.offset = {
            start: branchOneDocStart,
            end: branchOneDocEnd,
            length: branchOneDocLength
        };

        branchTwoNodes.push(tail);

        branchTwo.head = elseNode;
        branchTwo.nodes = branchTwoNodes;
        branchTwo.index = elseNode.index;

        const branchTwoStart = (elseNode.endPosition?.index ?? 0),
            branchTwoEnd = (elseNode.isClosedBy?.startPosition?.index ?? 0) - 1,
            branchTwoLength = branchTwoEnd - branchTwoStart,
            branchTwoDocStart = (elseNode.startPosition?.index ?? 0) - 1,
            branchTwoDocEnd = (elseNode.isClosedBy?.startPosition?.index ?? 0) - 1,
            branchTwoDocLength = branchTwoDocEnd - branchTwoDocStart;

        branchTwo.innerContent = document.getText(branchTwoStart, branchTwoEnd);
        branchTwo.documentContent = document.getText(branchTwoDocStart, branchTwoDocEnd);
        branchTwo.innerOffset = {
            start: branchTwoStart,
            end: branchTwoEnd,
            length: branchTwoLength
        };
        branchTwo.offset = {
            start: branchTwoDocStart,
            end: branchTwoDocEnd,
            length: branchTwoDocLength
        };

        condition.chain = [node.index, elseNode.index];
        condition.logicBranches.push(branchOne);
        condition.logicBranches.push(branchTwo);

        branchOne.startPosition = branchOne.nodes[0].startPosition;
        branchOne.endPosition = branchOne.nodes[branchOne.nodes.length - 1].startPosition;
        branchOne.childDocument = BladeDocument.childFromText(document.getNodeText(branchOneChildDocNodes), getStartPosition(branchOneChildDocNodes));
        branchTwo.childDocument = BladeDocument.childFromText(document.getNodeText(branchTwoChildDocNodes), getStartPosition(branchTwoChildDocNodes));

        branchTwo.startPosition = branchTwo.nodes[0].startPosition;
        branchTwo.endPosition = branchTwo.nodes[branchTwo.nodes.length - 1].startPosition;

        PairManager.registerSpeculativeCondition(node.directiveName);

        return condition;
    }
}