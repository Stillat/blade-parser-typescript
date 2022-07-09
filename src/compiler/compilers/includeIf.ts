import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class IncludeIfCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php if ($__env->exists(' + directive.getInnerContent() + ')) echo $__env->make(' + directive.getInnerContent() + ', \\Illuminate\\Support\\Arr::except(get_defined_vars(), [\'__data\', \'__path\']))->render(); ?>';
    }
}