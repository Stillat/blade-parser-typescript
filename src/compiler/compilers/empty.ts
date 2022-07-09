import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';
import { ForElseCompiler } from './forElse';

export class EmptyCompiler implements NodeCompiler {
    private forElseCompiler: ForElseCompiler;

    constructor(forElse: ForElseCompiler) {
        this.forElseCompiler = forElse;
    }
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        if (directive.hasDirectiveParameters) {
            return '<?php if(empty(' + directive.getInnerContent() + ')): ?>';
        }

        const result = '<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_' + this.forElseCompiler.getActiveLoop() + '): ?>';

        this.forElseCompiler.popLoop();

        return result;
    }
}