import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndSectionCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php $__env->stopSection(); ?>';
    }
}