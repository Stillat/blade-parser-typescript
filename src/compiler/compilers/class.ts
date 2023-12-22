import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ClassCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;


        return 'class="<?php echo \\Illuminate\\Support\\Arr::toCssClasses(' + directive.getInnerContent() + ') ?>"';
    }
}