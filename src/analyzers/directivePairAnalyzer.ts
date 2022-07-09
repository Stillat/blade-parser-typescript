import { BladeDocument } from '../document/bladeDocument';
import { getStartPosition } from '../nodes/helpers';
import { AbstractNode, ConditionNode, DirectiveNode, ExecutionBranchNode } from '../nodes/nodes';
import { BladeKeywords } from '../parser/bladeKeywords';
import { DocumentParser } from '../parser/documentParser';
import { intersect } from '../utilities/arrayHelpers';
import { ConditionPairAnalyzer } from './conditionPairAnalyzer';
import { ForElsePairAnalyzer } from './forElsePairAnalyzer';
import { PairManager } from './pairManager';
import { SpeculativeConditionAnalyzer } from './speculativeConditionAnalyzer';
import { SwitchPairAnalyzer } from './switchPairAnalyzer';

export class DirectivePairAnalyzer {
    static readonly ForceBreakLimit = 100000;
    private document: DocumentParser | null = null;
    private parentNode: DirectiveNode | null = null;
    private openDirectiveIndexCount: Map<number, Map<string, number>> = new Map();
    private closingDirectiveIndex: Map<number, Map<string, DirectiveNode[]>> = new Map();
    private closingDirectiveIndexCount: Map<number, Map<string, number>> = new Map();
    private closingDirectiveNames: Map<number, string[]> = new Map();
    private createdExecutionBranches: ExecutionBranchNode[] = [];

    private stackCount = 0;

    private buildCloseIndex(nodes: AbstractNode[]) {
        nodes.forEach((node) => {
            if ((node instanceof DirectiveNode) == false) { return; }
            const directive = node as DirectiveNode;

            if (directive.isClosingDirective == false) { return; }

            if (this.closingDirectiveIndex.has(this.stackCount) == false) {
                this.closingDirectiveIndex.set(this.stackCount, new Map());
            }

            if (this.closingDirectiveIndexCount.has(this.stackCount) == false) {
                this.closingDirectiveIndexCount.set(this.stackCount, new Map());
            }

            const directiveName = directive.name;

            if (this.closingDirectiveIndex.get(this.stackCount)?.has(directiveName) == false) {
                this.closingDirectiveIndex.get(this.stackCount)?.set(directiveName, []);
                this.closingDirectiveIndexCount.get(this.stackCount)?.set(directiveName, 0);
            }

            this.closingDirectiveIndex.get(this.stackCount)?.get(directiveName)?.push(node as DirectiveNode);
            const curCount = this.closingDirectiveIndexCount.get(this.stackCount)?.get(directiveName) ?? 0;
            this.closingDirectiveIndexCount.get(this.stackCount)?.set(directiveName, curCount + 1);
        });

        if (this.closingDirectiveNames.has(this.stackCount) == false) {
            this.closingDirectiveNames.set(this.stackCount, []);
        }

        // Process the closing tag index, if it has been set for the current stack level.
        if (this.closingDirectiveIndex.has(this.stackCount)) {
            this.closingDirectiveNames.set(this.stackCount, (Array.from(this.closingDirectiveIndex.get(this.stackCount)?.keys() ?? [])));

            this.closingDirectiveIndex.get(this.stackCount)?.forEach((indexedNodes, directiveName) => {
                const indexedNodeCount = indexedNodes.length;

                if (indexedNodeCount == 0) { return; }

                // Find the last closing directive candidate, and work up
                // to calculate a list of valid opening candidates.
                const lastIndexedNode = indexedNodes[indexedNodeCount - 1];

                for (let i = 0; i < indexedNodeCount; i++) {
                    const node = nodes[i];

                    if (node instanceof DirectiveNode) {
                        if (node.index >= lastIndexedNode.index) {
                            break;
                        }

                        const nodeDirectiveName = node.name;

                        if (node.isClosingDirective == false && nodeDirectiveName == directiveName) {
                            if (this.openDirectiveIndexCount.has(this.stackCount) == false) {
                                this.openDirectiveIndexCount.set(this.stackCount, new Map());
                            }

                            if (this.openDirectiveIndexCount.get(this.stackCount)?.has(directiveName) == false) {
                                this.openDirectiveIndexCount.get(this.stackCount)?.set(directiveName, 0);
                            }

                            const curCount = this.openDirectiveIndexCount.get(this.stackCount)?.get(directiveName) ?? 0;
                            this.openDirectiveIndexCount.get(this.stackCount)?.set(directiveName, curCount + 1);
                        }
                    }
                }
            });
        }
    }

    private getClosingCandidates(node: DirectiveNode) {
        const candidates: string[] = [];

        candidates.push(node.name);

        return candidates;
    }

    private getScanForList(node: DirectiveNode): string[] {
        if (node.isClosingDirective == false) {
            const candidates = this.getClosingCandidates(node),
                indexValues = this.closingDirectiveNames.get(this.stackCount) as string[];

            return intersect(candidates, indexValues) as string[];
        }

        return [];
    }

    associate(documentNodes: AbstractNode[], document: DocumentParser, refParent: DirectiveNode | null = null): AbstractNode[] {
        this.document = document;
        let nodesToReturn: AbstractNode[] = [];

        const nodeStack: DirectiveStackItem[] = [{
            documentNodes: documentNodes,
            parent: refParent
        }];

        while (nodeStack.length > 0) {
            const details = nodeStack.pop();

            if (details == null) { continue; }

            let nodes = details.documentNodes;
            this.parentNode = details.parent;

            this.stackCount += 1;
            this.buildCloseIndex(nodes);

            // Ask the specialized control structure analyzer to do its job first.
            nodes = ConditionPairAnalyzer.pairConditionals(nodes);

            nodes.forEach((node) => {
                if ((node instanceof DirectiveNode) && PairManager.canClose(node)) {
                    if (ConditionPairAnalyzer.isConditionalStructure(node)) {
                        return;
                    }

                    const scanFor = this.getScanForList(node);
                    this.findClosingPair(nodes, node, scanFor);
                }
            });

            // Step 1: Set the node parent relationships.
            const nodeCount = nodes.length;
            for (let i = 0; i < nodeCount; i++) {
                const node = nodes[i];

                if (node instanceof DirectiveNode && node.isClosedBy != null) {
                    for (let j = i + 1; j < nodeCount; j++) {
                        const childNode = nodes[j];

                        if (childNode.index > node.isClosedBy.index) {
                            break;
                        }

                        childNode.parent = node;

                        node.children.push(childNode);

                        if (childNode instanceof DirectiveNode && childNode.index == node.index) {
                            childNode.parent = node;
                            break;
                        }
                    }
                }
            }

            // Step 2: Build up the inner children nodes.
            nodes.forEach((node) => {
                if ((node instanceof DirectiveNode) && node.children.length > 0) {
                    const newChildren: AbstractNode[] = [],
                        refIds: string[] = [];

                    node.children.forEach((childNode) => {
                        if (childNode.parent != null) {
                            if (childNode.parent.index == node.index) {
                                const refId = childNode.refId as string;

                                if (!refIds.includes(refId)) {
                                    childNode.parent = node;
                                    newChildren.push(childNode);
                                    refIds.push(refId);
                                } else {
                                    return;
                                }
                            }
                        }
                    });

                    nodeStack.push({
                        documentNodes: newChildren,
                        parent: node
                    });
                }
            });

            // Step 3: Extract the "root" nodes. These will be our new "nested" nodes.
            let nestedNodes: AbstractNode[] = [];

            nodes.forEach((node) => {
                if (this.parentNode == null) {
                    if (node.parent == null) {
                        nestedNodes.push(node);
                    }
                } else {
                    if (node.parent?.refId == this.parentNode.refId) {
                        nestedNodes.push(node);
                    }
                }
            });

            nestedNodes = this.reduceConditions(nestedNodes, document);
            nestedNodes = SwitchPairAnalyzer.associate(nestedNodes, document);
            nestedNodes = ForElsePairAnalyzer.associate(nestedNodes, document);
            nestedNodes = SpeculativeConditionAnalyzer.analyze(nestedNodes, document);
            nestedNodes = this.cleanNodes(nestedNodes);
            const nestedNodeKeyMap: Map<string, number> = new Map();

            nodes.forEach((node) => {
                if ((node instanceof DirectiveNode) && node.isClosedBy != null) {
                    if (this.document != null) {
                        const content = this.document.getText(
                            (node.endPosition?.index ?? 0),
                            (node.isClosedBy.startPosition?.index ?? 0) - 1
                        );

                        node.documentContent = content;

                        if (node.name == 'php' || node.name == 'verbatim') {
                            if (node.innerContent.trim().length == 0) {
                                node.innerContent = node.documentContent;
                            }
                        }
                    }
                }
            });

            for (let i = 0; i < nestedNodes.length; i++) {
                const node = nestedNodes[i],
                    refId = node.refId ?? '';
                nestedNodeKeyMap.set(refId, 1);
            }

            if (this.parentNode != null && (this.parentNode instanceof DirectiveNode)) {
                this.parentNode.children = this.cleanNodes(nestedNodes);

                if (this.parentNode.parent != null && this.parentNode.parent instanceof DirectiveNode) {
                    const ancestorNodes = this.parentNode.parent.children,
                        newAncestorNodes: AbstractNode[] = [];

                    ancestorNodes.forEach((aNode) => {
                        // Because we are processing the deeply nested
                        // nodes *after* their parent nodes, we have
                        // to make sure to clean up the node tree.

                        if (nestedNodeKeyMap.has(aNode.refId ?? '') == false) {
                            newAncestorNodes.push(aNode);
                        }
                    });

                    this.parentNode.parent.children = this.cleanNodes(newAncestorNodes);
                }
            }

            if (this.stackCount <= 1) {
                nodesToReturn = this.cleanNodes(nestedNodes);
            }
        }

        return nodesToReturn;
    }

    private cleanNodes(nodes: AbstractNode[]): AbstractNode[] {
        const cleaned: AbstractNode[] = [],
            ids: string[] = [];

        for (let i = 0; i < nodes.length; i++) {
            const child = nodes[i],
                refId = child.refId as string;

            if (ids.includes(refId)) { break; }
            cleaned.push(child);
            ids.push(refId);
        }

        return cleaned;
    }

    private reduceConditions(nodes: AbstractNode[], document: DocumentParser) {
        const reduced: AbstractNode[] = [];

        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];

            if ((node instanceof DirectiveNode) && node.isClosingDirective == false && node.isClosedBy != null) {
                const compound = node.name;

                if (compound == BladeKeywords.If) {
                    const conditionNode = new ConditionNode(),
                        finalClosing = node.getFinalClosingDirective();
                    conditionNode.withParser(document);
                    conditionNode.index = node.index;
                    conditionNode.chain.push(node.index);
                    conditionNode.startPosition = node.startPosition;
                    conditionNode.endPosition = finalClosing.endPosition;
                    conditionNode.constructedFrom = node;

                    const startOffset = (node.startPosition?.index ?? 0) - 1,
                        length = finalClosing?.endPosition?.index ?? 0 - (node.startPosition?.index ?? 0),
                        endOffset = startOffset + length;
                    conditionNode.nodeContent = document.getText(startOffset, length);

                    conditionNode.offset = {
                        start: startOffset,
                        end: endOffset,
                        length: length
                    };

                    if (this.parentNode != null) {
                        conditionNode.parent = this.parentNode;
                    }

                    let exitedOn: number | null = null,
                        doContinue = true,
                        currentDepth = 0;

                    while (doContinue) {
                        currentDepth += 1;

                        // Attempt to prevent infinite loops.
                        if (currentDepth > DirectivePairAnalyzer.ForceBreakLimit) {
                            doContinue = false;
                            break;
                        }

                        if ((node instanceof DirectiveNode)) {
                            const result = this.findEndOfBranch(nodes.slice(i + 1), node, i),
                                executionBranch = new ExecutionBranchNode();

                            executionBranch.withParser(document);
                            let tail = result.tail;

                            executionBranch.head = node;
                            executionBranch.tail = tail;
                            executionBranch.nodes = this.cleanNodes(node.children);

                            const childDocNodes = [...executionBranch.nodes],
                                lastNode = childDocNodes[childDocNodes.length - 1];

                            if (lastNode instanceof DirectiveNode && lastNode.refId == node.isClosedBy?.refId) {
                                childDocNodes.pop();
                            }

                            const branchStart = (node.endPosition?.index ?? 0),
                                branchEnd = (node.isClosedBy?.startPosition?.index ?? 0) - 1,
                                length = branchEnd - branchStart,

                                branchDocStart = (node.startPosition?.index ?? 0) - 1,
                                branchDocEnd = (node.isClosedBy?.startPosition?.index ?? 0) - 1,
                                branchDocLength = branchDocEnd - branchDocStart;

                            executionBranch.innerContent = document.getText(branchStart, branchEnd);
                            executionBranch.documentContent = document.getText(branchDocStart, branchDocEnd);

                            executionBranch.innerOffset = {
                                start: branchStart,
                                end: branchEnd,
                                length: length
                            };

                            executionBranch.offset = {
                                start: branchDocStart,
                                end: branchDocEnd,
                                length: branchDocLength
                            };

                            executionBranch.childDocument = BladeDocument.childFromText(document.getNodeText(childDocNodes), getStartPosition(childDocNodes));

                            if (tail == null) {
                                tail = executionBranch.head.isClosedBy;
                            }

                            if (tail != null && tail.startPosition != null) {
                                executionBranch.startPosition = tail.startPosition;
                            }

                            if (tail != null) {
                                executionBranch.index = tail.index;
                            }

                            if (executionBranch.nodes.length > 0) {
                                const lastNode = executionBranch.nodes[executionBranch.nodes.length - 1];

                                if (lastNode.endPosition != null) {
                                    executionBranch.endPosition = lastNode.endPosition;
                                }
                            } else {
                                if (tail != null && tail.endPosition != null) {
                                    executionBranch.endPosition = tail.endPosition;
                                }
                            }

                            // Maintain a record of all created execution branches.
                            this.createdExecutionBranches.push(executionBranch);

                            conditionNode.logicBranches.push(executionBranch);

                            if (tail?.isClosingDirective && tail.name == BladeKeywords.If) {
                                exitedOn = result.offset;
                                doContinue = false;
                                break;
                            } else {
                                if (tail != null) {
                                    conditionNode.chain.push(tail.index);
                                }

                                i = result.offset;
                                if (tail instanceof DirectiveNode) {
                                    node = tail;
                                }
                            }
                        } else {
                            doContinue = false;
                        }
                    }

                    reduced.push(conditionNode);

                    if (exitedOn != null) {
                        if (exitedOn == nodes.length) {
                            break;
                        }
                    }
                } else {
                    reduced.push(node);
                }
            } else {
                reduced.push(node);
            }
        }

        return reduced;
    }

    private findEndOfBranch(nodes: AbstractNode[], start: DirectiveNode, startedAt: number) {
        const children: AbstractNode[] = [],
            offset = startedAt;
        let tail: DirectiveNode | null = null;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if ((node instanceof DirectiveNode) && node.isOpenedBy != null && node.isOpenedBy == start) {
                tail = node;
                break;
            } else {
                children.push(node);
            }
        }

        return {
            children: children,
            tail: tail,
            offset: offset
        };
    }

    private findClosingPair(nodes: AbstractNode[], node: DirectiveNode, scanFor: string[]) {
        const nodeLength = nodes.length;
        let refStack = 0;

        for (let i = 0; i < nodeLength; i++) {
            const candidateNode = nodes[i];

            if ((candidateNode instanceof DirectiveNode) == false) { continue; }
            if (candidateNode.startPosition == null || node.endPosition == null) { continue; }
            if (!node.endPosition.isBefore(candidateNode.startPosition)) { continue; }
            const directiveCandidate = candidateNode as DirectiveNode;

            if (directiveCandidate.isClosingDirective && directiveCandidate.isOpenedBy != null) { continue; }
            if (!directiveCandidate.isClosingDirective && directiveCandidate.isClosedBy != null) { continue; }

            const directiveName = directiveCandidate.name;

            if (!directiveCandidate.isClosingDirective) {
                if (scanFor.includes(directiveName)) {
                    refStack += 1;
                    continue;
                }
            }

            if (scanFor.includes(directiveName)) {
                if (refStack > 0) {
                    refStack -= 1;
                    continue;
                }
            }

            if (refStack == 0 && scanFor.includes(directiveName)) {
                directiveCandidate.isOpenedBy = node;
                node.isClosedBy = directiveCandidate;
                break;
            }
        }
    }
}

interface DirectiveStackItem {
    documentNodes: AbstractNode[],
    parent: DirectiveNode | null
}