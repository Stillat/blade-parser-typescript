import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndVerbatimCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '';
    }
}