import { AbstractNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class EndSlotCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return `<?php $__env->endSlot(); ?>`;
    }
}