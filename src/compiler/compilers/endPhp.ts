import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndPhpCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '?>';
    }
}