import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndWhileCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endwhile; ?>';
    }
}