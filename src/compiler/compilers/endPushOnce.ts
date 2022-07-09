import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndPushOnceCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php $__env->stopPush(); endif; ?>';
    }
}