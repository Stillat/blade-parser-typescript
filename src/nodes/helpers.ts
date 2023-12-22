import { AbstractNode } from './nodes.js';
import { Position } from './position.js';

export function getStartPosition(nodes: AbstractNode[]): Position | null {
    if (nodes.length == 0) { return null; }

    return nodes[0].startPosition;
}