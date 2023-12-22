import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class AuthCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        if (directive.hasDirectiveParameters) {
            return '<?php if(auth()->guard(' + directive.getInnerContent() + ')->check()): ?>'
        }

        return '<?php if(auth()->guard()->check()): ?>'
    }
}