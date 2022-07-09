import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class IncludeUnlessCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php echo $__env->renderUnless(' + directive.getInnerContent() + ', \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\'])); ?>';
    }
}