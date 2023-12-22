import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndProductionCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endif; ?>';
    }
}