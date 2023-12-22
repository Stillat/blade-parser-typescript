import { DirectiveNode } from '../nodes/nodes.js';
import { DirectiveIdResolver } from './directiveIdResolver.js';
import { v4 as uuidv4 } from 'uuid';

export class UuidDirectiveIdResolver implements DirectiveIdResolver {
    id(node: DirectiveNode): string {
        return uuidv4();
    }
}