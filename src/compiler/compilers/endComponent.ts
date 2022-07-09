import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndComponentCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php echo $__env->renderComponent(); ?>';
    }
}