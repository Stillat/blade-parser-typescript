import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ElseCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php else: ?>';
    }
}