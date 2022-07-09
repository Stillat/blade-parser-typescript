import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class UnlessCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php if (! (' + directive.getInnerContent() + ')): ?>';
    }
}