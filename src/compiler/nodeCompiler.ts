import { AbstractNode } from '../nodes/nodes';

export interface NodeCompiler {
    compile(node: AbstractNode): string
}