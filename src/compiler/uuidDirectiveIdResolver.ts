import { DirectiveNode } from '../nodes/nodes';
import { DirectiveIdResolver } from './directiveIdResolver';
import { v4 as uuidv4 } from 'uuid';

export class UuidDirectiveIdResolver implements DirectiveIdResolver {
    id(node: DirectiveNode): string {
        return uuidv4();
    }
}