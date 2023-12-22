import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndPhpCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '?>';
    }
}