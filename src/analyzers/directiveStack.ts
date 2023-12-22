import { AbstractNode, BladeEchoNode, BladeEntitiesEchoNode, BladeEscapedEchoNode, BladeVerbatimNode, DirectiveNode, LiteralNode } from '../nodes/nodes.js';

export class DirectiveStack {
    static setChildTypeCounts(nodes: AbstractNode[]) {
        nodes.forEach((node) => {
            if (node instanceof DirectiveNode == false) { return; }
            const directive = node as DirectiveNode;

            directive.getImmediateChildren().forEach((child) => {
                let childType = '*unknown',
                    parentIndex = 0;

                if (child instanceof LiteralNode) {
                    childType = '*literal';
                } else if (child instanceof BladeEntitiesEchoNode) {
                    childType = '*entities_echo';
                } else if (child instanceof BladeEscapedEchoNode) {
                    childType = '*escaped_echo';
                } else if (child instanceof BladeEchoNode) {
                    childType = '*echo';
                } else if (child instanceof BladeVerbatimNode) {
                    childType = '*verbatim';
                } else if (child instanceof DirectiveNode) {
                    childType = child.directiveName;
                }

                if (directive.childTypeCounts.has(childType) == false) {
                    directive.childTypeCounts.set(childType, 0);
                }

                const curCount = directive.childTypeCounts.get(childType) as number,
                    relativeCount = curCount + 1;
                directive.childTypeCounts.set(childType, relativeCount);
                child.parentTypeIndex = relativeCount;

                child.parentIndex = parentIndex;

                parentIndex += 1;
            });
        });
    }
}