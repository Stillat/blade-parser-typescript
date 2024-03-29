import { AbstractNode, BladeEchoNode, LiteralNode } from '../nodes/nodes.js';
import { StringUtilities } from '../utilities/stringUtilities.js';

export class InlineEchoAnalyzer {
    static analyze(nodes: AbstractNode[]) {
        nodes.forEach((node) => {
            if (node instanceof BladeEchoNode) {
                let isRightInline = false,
                    isLeftInline = false;

                if (node.nextNode == null) {
                    isRightInline = true;
                } else if (node.nextNode instanceof LiteralNode) {
                    const firstLine = StringUtilities.getFirstLine(node.nextNode.content);

                    if (StringUtilities.trimLeft(firstLine, " \t").startsWith("\n") == false && firstLine.trim().length > 0) {
                        isRightInline = true;
                    } else {
                        if (node.nextNode.nextNode instanceof BladeEchoNode) {
                            if (node.nextNode.nextNode.startPosition?.line == node.endPosition?.line) {
                                isRightInline = true;
                            }
                        }
                    }
                } else if (node.nextNode instanceof BladeEchoNode) {
                    isRightInline = true;
                }

                if (node.prevNode == null) {
                    isLeftInline = true;
                } else if (node.prevNode instanceof LiteralNode) {
                    const lastLine = StringUtilities.getLastLine(node.prevNode.content);

                    if (StringUtilities.trimRight(lastLine, " \t").endsWith("\n") == false && lastLine.trim().length > 0) {
                        isLeftInline = true;
                    } else {
                        if (node.prevNode.prevNode instanceof BladeEchoNode) {
                            if (node.prevNode.prevNode.endPosition?.line == node.startPosition?.line) {
                                isLeftInline = true;
                            }
                        }
                    }
                } else if (node.prevNode instanceof BladeEchoNode) {
                    isLeftInline = true;
                }

                node.isInlineEcho = (isRightInline || isLeftInline);
            }
        });
    }
}