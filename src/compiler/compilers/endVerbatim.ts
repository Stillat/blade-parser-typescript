import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndVerbatimCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '';
    }
}