import { AbstractNode, BladeComponentNode } from '../nodes/nodes.js';

export class ComponentSlotPairAnalyzer {
    protected static findClosingTag(nodes: AbstractNode[], index: number, node: BladeComponentNode) {
        let refCount = 0;

        if (node.name?.inlineName != null && node.name.inlineName != '') {
            node.isShorthandSlot = true;
        }

        for (let i = index; i < nodes.length; i++) {
            const candidate = nodes[i];

            if (candidate instanceof BladeComponentNode) {
                if (candidate.isClosedBy != null || candidate.isOpenedBy != null) {
                    continue;
                }

                if (candidate.name?.name == 'slot') {
                    if (candidate.isSelfClosing == false && candidate.isClosingTag == false) {
                        refCount += 1;
                        continue;
                    } else if (candidate.isSelfClosing == false && candidate.isClosingTag) {
                        refCount -=1;

                        if (refCount > 0) {
                            continue;
                        }

                        node.isClosedBy = candidate;
                        candidate.isOpenedBy = node;
                        break;
                    }
                }
            }
        }
    }

    static pairComponents(nodes: AbstractNode[]) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];

            if (node instanceof BladeComponentNode) {
                if (node.name?.name == 'slot' && node.isSelfClosing == false && node.isClosingTag == false) {
                    ComponentSlotPairAnalyzer.findClosingTag(nodes, i, node);
                }
            }
        }

        return nodes;
    }
}