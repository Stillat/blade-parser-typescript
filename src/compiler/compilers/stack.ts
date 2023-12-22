import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class StackCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode,
            params = directive.getInnerContent();

        return `<?php echo $__env->yieldPushContent(${params}); ?>`;
    }
}