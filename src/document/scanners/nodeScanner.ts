import { AbstractNode, BladeCommentNode, DirectiveNode, LiteralNode } from '../../nodes/nodes.js';
import { Position } from '../../nodes/position.js';
import { BladeDocument } from '../bladeDocument.js';
import { NodeQueries } from './nodeQueries.js';

export class NodeScanner {
    private doc: BladeDocument;

    constructor(doc: BladeDocument) {
        this.doc = doc;
    }

    firstDirectiveOfType(name: string): DirectiveNode | null {
        const nodes = this.doc.getAllNodes();

        for (let i = 0; i < nodes.length; i++) {
            const thisNode = nodes[i];

            if (thisNode instanceof DirectiveNode && thisNode.directiveName == name) {
                return thisNode;
            }
        }

        return null;
    }

    getNodeAt(position: Position | null): AbstractNode | null {
        return NodeQueries.findNodeAtPosition(position, this.doc.getParser().getNodes());
    }

    getNodesBefore(position: Position | null): AbstractNode[] {
        return NodeQueries.findNodesBeforePosition(position, this.doc.getParser().getNodes());
    }

    getNodeBefore(position: Position | null): AbstractNode | null {
        return NodeQueries.findNodeBeforePosition(position, this.doc.getParser().getNodes());
    }

    getNodeAfter(position: Position | null): AbstractNode | null {
        return NodeQueries.findNodeAfterPosition(position, this.doc.getParser().getNodes());
    }

    getNodesAfter(position: Position | null): AbstractNode[] {
        return NodeQueries.findNodesAfterPosition(position, this.doc.getParser().getNodes());
    }

    filter(predicate: (value: AbstractNode, index: number, array: AbstractNode[]) => value is AbstractNode) {
        return this.doc.getParser().getNodes().filter(predicate);
    }

    getComments(): BladeCommentNode[] {
        const nodes: BladeCommentNode[] = [];

        this.doc.getAllNodes().forEach((node) => {
            if (node instanceof BladeCommentNode) {
                nodes.push(node);
            }
        });

        return nodes;
    }

    /**
     * Retrieves all literal and escaped content nodes in the document.
     */
    getAllLiteralNodes(): LiteralNode[] {
        const nodes: LiteralNode[] = [];

        this.doc.getAllNodes().forEach((node) => {
            if (node instanceof LiteralNode) {
                nodes.push(node);
            }
        });

        return nodes;
    }
}