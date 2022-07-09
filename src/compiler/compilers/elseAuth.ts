import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class ElseAuthCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        if (directive.hasDirectiveParameters) {
            return '<?php elseif(auth(' + directive.getInnerContent() + ')->guard()->check()): ?>'
        }

        return '<?php elseif(auth()->guard()->check()): ?>'
    }
}