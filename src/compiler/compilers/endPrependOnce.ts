import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndPrependOnceCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return '<?php $__env->stopPrepend(); endif; ?>';
    }
}