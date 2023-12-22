import { BladeError } from '../errors/bladeError.js';
import { BladeErrorCodes } from '../errors/bladeErrorCodes.js';
import { AbstractNode, DirectiveNode } from '../nodes/nodes.js';
import { BladeKeywords } from '../parser/bladeKeywords.js';

export class ConditionPairAnalyzer {
    static isConditionalStructure(node: AbstractNode): boolean {
        if (node instanceof DirectiveNode == false) {
            return false;
        }

        const directive = node as DirectiveNode,
            name = directive.name;

        if (name == BladeKeywords.If || name == BladeKeywords.ElseIf || name == BladeKeywords.Else) {
            return true;
        }

        return false;
    }

    protected static requiresClose(node: DirectiveNode) {
        const name = node.name;

        if (name == BladeKeywords.ElseIf || name == BladeKeywords.Else) {
            if (node.isClosedBy != null) {
                return false;
            }

            return true;
        }

        if (node.isClosingDirective) {
            return false;
        }

        if (node.isClosedBy != null) {
            return false;
        }

        return true;
    }

    /**
     * A list of valid closing names for common conditional node types.
     */
    protected static conditionClosingPairs: string[] = ['elseif', 'else'];

    /**
     * Returns a list of valid closing node names for the provided node.
     * 
     * @param current The current node's name.
     * @returns 
     */
    protected static getValidClosingPairs(current: string) {
        if (current == BladeKeywords.If || current == BladeKeywords.ElseIf) {
            return ConditionPairAnalyzer.conditionClosingPairs;
        }

        return [];
    }

    /**
    * Descends through the nodes to find the closest logical
    * closing node for each opening conditional node type.
    * 
    * @param nodes  The nodes to analyze.
    * @param node The primary node.
    * @param index  The primary node starting index.
    */
    protected static findClosestStructurePair(nodes: AbstractNode[], node: DirectiveNode, index: number) {
        const stack: ConditionPairStackItem[] = [],
            nodeLen = nodes.length,
            conditionCloseIndex: Map<number, number> = new Map();

        stack.push({
            node: node,
            index: index
        });

        for (let i = 0; i < nodeLen; i += 1) {
            const node = nodes[i];

            if (node instanceof DirectiveNode) {
                const name = node.name;

                if (node.isClosingDirective && name == BladeKeywords.If) {
                    conditionCloseIndex.set(i, i);
                    continue;
                } else {
                    if (name == BladeKeywords.ElseIf || name == BladeKeywords.Else) {
                        conditionCloseIndex.set(i, i);
                        continue;
                    }
                }
            }
        }

        while (stack.length > 0) {
            const curItem = stack.pop();

            if (curItem == null) {
                continue;
            }

            if (curItem.node._conditionParserAbandonPairing) {
                break;
            }

            const curNode = curItem.node,
                thisValidPairs = ConditionPairAnalyzer.getValidClosingPairs(curNode.name);

            let curIndex = curItem.index,
                doSkipValidation = false;

            for (let i = curIndex; i < nodeLen; i++) {
                const subNode = nodes[i];

                if (subNode instanceof DirectiveNode) {
                    if (ConditionPairAnalyzer.isConditionalStructure(subNode)) {
                        if (ConditionPairAnalyzer.requiresClose(subNode)) {
                            if (i == nodeLen - 1) {
                                doSkipValidation = false;
                                break;
                            }
                            stack.push(curItem);
                            stack.push({
                                node: subNode,
                                index: i + 1
                            });
                            doSkipValidation = true;
                            break;
                        }

                        if (curNode.isClosedBy != null) {
                            continue;
                        }

                        const subNodeName = subNode.name;

                        let canClose = false;

                        if (subNode.ref == 0 && ((subNode.isClosingDirective && subNodeName == BladeKeywords.If) ||
                            thisValidPairs.includes(subNodeName)
                        )) {
                            canClose = true;
                        }

                        if (subNode.refId == curNode.refId) {
                            canClose = false;
                        }

                        if (canClose) {
                            conditionCloseIndex.delete(i);
                            curNode.isClosedBy = subNode;
                            subNode.isOpenedBy = curNode;
                            subNode.ref += 1;
                            doSkipValidation = true;
                            break;
                        }
                    }
                }
            }

            if (!doSkipValidation) {
                if (curNode instanceof DirectiveNode) {
                    const nodeName = curNode.name;

                    if ((nodeName == BladeKeywords.ElseIf || nodeName == BladeKeywords.Else) && curNode.isOpenedBy == null) {
                        curNode.pushError(BladeError.makeSyntaxError(
                            BladeErrorCodes.TYPE_PARSE_UNCLOSED_CONDITION,
                            curNode,
                            'Unpaired condition control structure'
                        ));
                        curNode._conditionParserAbandonPairing = true;
                    }

                    if (curNode.isClosedBy == null && ConditionPairAnalyzer.requiresClose(curNode)) {
                        curNode.pushError(BladeError.makeSyntaxError(
                            BladeErrorCodes.TYPE_PARSE_UNCLOSED_CONDITION,
                            curNode,
                            'Unpaired condition control structure'
                        ));
                        curNode._conditionParserAbandonPairing = true;
                    }
                }
            }
        }
    }

    static pairConditionals(nodes: AbstractNode[]) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];

            if (node instanceof DirectiveNode && ConditionPairAnalyzer.isConditionalStructure(node)) {
                if (ConditionPairAnalyzer.requiresClose(node)) {
                    ConditionPairAnalyzer.findClosestStructurePair(nodes, node, i + 1);
                }
            }
        }

        nodes.forEach((node) => {
            if (node instanceof DirectiveNode && ConditionPairAnalyzer.isConditionalStructure(node)) {
                const name = node.name;

                if ((name == BladeKeywords.ElseIf || name == BladeKeywords.Else) && node.isOpenedBy == null) {
                    node.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_PARSE_UNCLOSED_CONDITION,
                        node,
                        'Unpaired condition control structure'
                    ));
                    node._conditionParserAbandonPairing = true;
                    return;
                }

                if (node.isClosedBy == null && ConditionPairAnalyzer.requiresClose(node)) {
                    node.pushError(BladeError.makeSyntaxError(
                        BladeErrorCodes.TYPE_PARSE_UNCLOSED_CONDITION,
                        node,
                        'Unpaired condition control structure'
                    ));
                    node._conditionParserAbandonPairing = true;
                    return;
                }
            }
        });

        return nodes;
    }
}

interface ConditionPairStackItem {
    node: DirectiveNode,
    index: number
}