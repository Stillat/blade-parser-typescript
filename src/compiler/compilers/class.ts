import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class ClassCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;


        return 'class="<?php echo \\Illuminate\\Support\\Arr::toCssClasses(' + directive.getInnerContent() + ') ?>"';
    }
}