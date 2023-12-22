import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class GuestCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<?php if(auth()->guard(' + directive.getInnerContent() + ')->guest()): ?>';
    }
}