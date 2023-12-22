import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndComponentCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php echo $__env->renderComponent(); ?>';
    }
}