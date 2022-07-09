import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndPushCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php $__env->stopPush(); ?>';
    }
}