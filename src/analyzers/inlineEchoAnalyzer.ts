import { AbstractNode, BladeEchoNode, LiteralNode } from '../nodes/nodes';
import { StringUtilities } from '../utilities/stringUtilities';

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
                            isRightInline = true;
                        }
                    }
                }

                if (node.prevNode == null) {
                    isLeftInline = true;
                } else if (node.prevNode instanceof LiteralNode) {
                    const lastLine = StringUtilities.getLastLine(node.prevNode.content);

                    if (StringUtilities.trimRight(lastLine, " \t").endsWith("\n") == false && lastLine.trim().length > 0) {
                        isLeftInline = true;
                    } else {
                        if (node.prevNode.prevNode instanceof BladeEchoNode) {
                            isLeftInline = true;
                        }
                    }
                }

                node.isInlineEcho = (isRightInline || isLeftInline);
            }
        });
    }
}