import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class ElseCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php else: ?>';
    }
}