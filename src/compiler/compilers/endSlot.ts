import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class EndSlotCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        return `<?php $__env->endSlot(); ?>`;
    }
}