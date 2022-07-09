import { AbstractNode, DirectiveNode } from '../nodes/nodes';
import { BladeKeywords } from '../parser/bladeKeywords';
import { PairManager } from './pairManager';

export class ConditionalRewriteAnalyzer {

    static getNewName(node: DirectiveNode): string {
        if (node.name == BladeKeywords.Unless) { return BladeKeywords.If; }

        if (PairManager.isSpeculativeEndIf(node.directiveName)) {
            return BladeKeywords.If;
        }

        if (PairManager.isSpeculativeCondition(node.name)) {
            return BladeKeywords.If;
        }

        if (PairManager.customIfs.has(node.name)) {
            const lowerDirectiveName = node.directiveName.toLowerCase();

            if (lowerDirectiveName.startsWith('else')) {
                node.isClosingDirective = true;

                return BladeKeywords.ElseIf;
            } else if (lowerDirectiveName.startsWith('end')) {
                node.isClosingDirective = true;

                return BladeKeywords.If;
            }

            return BladeKeywords.If;
        }

        if (node.directiveName == 'auth') {
            return BladeKeywords.If;
        }

        return node.name;
    }

    static rewrite(nodes: AbstractNode[]) {
        const returnNodes: AbstractNode[] = [];

        nodes.forEach((node) => {
            if (node instanceof DirectiveNode) {
                if (PairManager.shouldRewrite(node)) {
                    const clone = node.clone();
                    clone.name = this.getNewName(node);

                    returnNodes.push(clone);
                } else {
                    returnNodes.push(node);
                }
            } else {
                returnNodes.push(node);
            }
        });

        return returnNodes;
    }
}