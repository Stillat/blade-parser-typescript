import { BladeComponentNode, ConditionNode, DirectiveNode, ForElseNode, FragmentPosition, LiteralNode, SwitchStatementNode } from '../nodes/nodes';
import { DocumentParser } from '../parser/documentParser';
import { FragmentsParser } from '../parser/fragmentsParser';

export class FragmentPositionAnalyzer {
    private documentParser: DocumentParser;
    private fragmentsParser: FragmentsParser;

    constructor(document: DocumentParser, fragments: FragmentsParser) {
        this.documentParser = document;
        this.fragmentsParser = fragments;
    }

    private doesContainFragments(directive: DirectiveNode): boolean {
        const startIndex = directive.endPosition?.index ?? 0,
            endIndex = directive.isClosedBy?.startPosition?.index ?? 0;


        return this.fragmentsParser.getFragmentsBetween(startIndex, endIndex).length > 0;
    }

    analyze() {
        const allNodes = this.documentParser.getNodes();

        if (!this.fragmentsParser.hasFragments()) {
            return;
        }

        this.fragmentsParser.getFragments().forEach((fragment) => {
            const lowerName = fragment.name.toLowerCase();

            if (fragment.isClosingFragment == false && fragment.isSelfClosing == false && (lowerName == 'script' || lowerName == 'style')) {
                const closingFragment = this.fragmentsParser.getClosingFragmentAfter(fragment);

                if (closingFragment == null) { return; }

                if (fragment.endPosition != null && closingFragment.startPosition != null) {
                    const containedNodes = this.documentParser.getNodesBetween(fragment.endPosition, closingFragment.startPosition);

                    containedNodes.forEach((node) => {
                        if (node instanceof ConditionNode ||
                            node instanceof ForElseNode ||
                            node instanceof BladeComponentNode ||
                            node instanceof SwitchStatementNode) {
                            fragment.containsStructures = true;
                        } else if (node instanceof DirectiveNode) {
                            if (node.isClosedBy != null) {
                                fragment.containsStructures = true;
                            }
                        }

                        if (lowerName == 'style') {
                            node.isInStyleTag = true;
                        } else {
                            node.isInScriptTag = true;
                        }
                    });
                }
            }
        });

        allNodes.forEach((node) => {
            if (node instanceof LiteralNode) { return; }
            if (node.startPosition == null) { return; }

            if (node instanceof DirectiveNode && !node.isClosingDirective && node.isClosedBy != null) {
                node.containsAnyFragments = this.doesContainFragments(node);
            }

            const fragment = this.fragmentsParser.getFragmentContaining(node.startPosition);

            if (fragment == null) { return; }
            node.fragment = fragment;
            const startDelta = node.startPosition.index - (fragment.startPosition?.index ?? 0);

            if (startDelta <= 3) {
                node.fragmentPosition = FragmentPosition.IsDynamicFragmentName;
                return;
            }

            if (fragment.parameters.length == 0) {
                node.fragmentPosition = FragmentPosition.InsideFragment;
                return;
            }

            let resolvedParam = false;
            for (let i = 0; i < fragment.parameters.length; i++) {
                const thisParam = fragment.parameters[i];

                if ((thisParam.startPosition?.index ?? 0) < node.startPosition.index && (thisParam.endPosition?.index ?? 0) > node.startPosition.index) {
                    node.fragmentPosition = FragmentPosition.InsideFragmentParameter;
                    resolvedParam = true;
                    break;
                }
            }

            if (!resolvedParam) {
                node.fragmentPosition = FragmentPosition.InsideFragment;
            }
        });
    }
}