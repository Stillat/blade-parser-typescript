import { AbstractNode } from '../nodes/nodes.js';

export interface NodeCompiler {
    compile(node: AbstractNode): string
}