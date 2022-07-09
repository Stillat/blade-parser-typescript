import { AbstractNode } from './nodes';
import { Position } from './position';

export function getStartPosition(nodes: AbstractNode[]): Position | null {
    if (nodes.length == 0) { return null; }

    return nodes[0].startPosition;
}