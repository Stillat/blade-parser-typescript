import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndPrependCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php $__env->stopPrepend(); ?>';
    }
}