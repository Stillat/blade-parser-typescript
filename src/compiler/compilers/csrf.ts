import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class CsrfCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php echo csrf_field(); ?>';
    }
}