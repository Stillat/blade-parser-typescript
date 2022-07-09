import { AbstractNode, LiteralNode } from '../../nodes/nodes';
import { Position } from '../../nodes/position';

export class NodeQueries {
    static findNodeAfterPosition(position: Position | null, nodes: AbstractNode[]): AbstractNode | null {
        if (position == null) {
            return null;
        }

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (NodeQueries.isLiteralType(node)) {
                continue;
            }

            if (node.startPosition != null) {
                if (node.startPosition.index > position.index) {
                    return node;
                }
            }
        }

        return null;
    }

    static findNodeBeforePosition(position: Position | null, nodes: AbstractNode[]): AbstractNode | null {
        if (position == null) {
            return null;
        }

        let lastNode: AbstractNode | null = null;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (NodeQueries.isLiteralType(node)) {
                continue;
            }

            if (node.startPosition != null) {
                if (node.startPosition.index > position.index) {
                    break;
                }

                lastNode = node;
            }
        }

        return lastNode;
    }

    static findNodeAtPosition(position: Position | null, nodes: AbstractNode[]): AbstractNode | null {
        if (position == null) {
            return null;
        }

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (NodeQueries.isLiteralType(node)) {
                continue;
            }

            if (node.startPosition != null && node.endPosition != null) {
                if (position.index >= node.startPosition.index && position.index <= node.endPosition.index) {
                    return node;
                }
            }
        }

        return null;
    }

    static isLiteralType(node: AbstractNode): boolean {
        if (node instanceof LiteralNode) {
            return true;
        }

        return false;
    }

    static findNodesBeforePosition(position: Position | null, nodes: AbstractNode[]): AbstractNode[] {
        const beforeNodes: AbstractNode[] = [];

        if (position == null) {
            return beforeNodes;
        }

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (NodeQueries.isLiteralType(node)) {
                continue;
            }

            if (node.startPosition != null && node.endPosition != null) {
                if (node.startPosition.index > position.index) {
                    break;
                }

                beforeNodes.push(node);
            }
        }

        return beforeNodes;
    }

    static findNodesAfterPosition(position: Position | null, nodes: AbstractNode[]): AbstractNode[] {
        const afterNodes: AbstractNode[] = [];

        if (position == null) {
            return afterNodes;
        }

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (NodeQueries.isLiteralType(node)) {
                continue;
            }

            if (node.startPosition != null) {
                if (node.startPosition.index > position.index) {
                    afterNodes.push(node);
                }
            }
        }

        return afterNodes;
    }
}