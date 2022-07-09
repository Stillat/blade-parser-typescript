import { DirectiveNode } from '../nodes/nodes';

export interface DirectiveIdResolver {
    id(node: DirectiveNode): string,
}