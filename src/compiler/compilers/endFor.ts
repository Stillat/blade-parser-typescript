import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndForCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php endfor; ?>';
    }

}