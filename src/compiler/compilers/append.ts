import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class AppendCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php $__env->appendSection(); ?>';
    }

}