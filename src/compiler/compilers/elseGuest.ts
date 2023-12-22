import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ElseGuestCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php elseif(auth()->guard(' + directive.getInnerContent() + ')->guest()): ?>';
    }
}