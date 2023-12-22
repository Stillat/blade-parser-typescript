import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ForElseCompiler implements NodeCompiler {
    private loops = 1;
    private activeLoop = 1;

    getActiveLoop() {
        return this.activeLoop;
    }

    popLoop() {
        this.activeLoop -= 1;
        this.loops -= 1;
    }

    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            content = directive.getInnerContent(),
            split = this.getVars(content),
            loopVar = split[0].trim(),
            tempVar = split[1].trim();
        this.activeLoop = this.loops;

        let result = '<?php $__empty_' + this.activeLoop + ' = true; $__currentLoopData = ' + loopVar + '; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as ' + tempVar + '): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_' + this.activeLoop + ' = false; ?>';

        this.loops += 1;

        return result;
    }

    private getVars(content: string): string[] {
        const split = content.split(' as ');

        if (split.length == 1) {
            return content.split(' AS ');
        }

        return split;
    }
}