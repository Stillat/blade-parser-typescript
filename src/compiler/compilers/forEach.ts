import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ForEachCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            content = directive.getInnerContent(),
            split = this.getVars(content),
            loopVar = split[0].trim(),
            tempVar = split[1].trim();
        return '<?php $__currentLoopData = ' + loopVar + '; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as ' + tempVar + '): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>';
    }

    private getVars(content: string): string[] {
        const split = content.split(' as ');

        if (split.length == 1) {
            return content.split(' AS ');
        }

        return split;
    }
}