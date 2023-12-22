import { DirectiveNode } from '../nodes/nodes.js';

export interface DirectiveIdResolver {
    id(node: DirectiveNode): string,
}