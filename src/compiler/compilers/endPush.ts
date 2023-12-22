import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndPushCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php $__env->stopPush(); ?>';
    }
}