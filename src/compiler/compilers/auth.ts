import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class AuthCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        if (directive.hasDirectiveParameters) {
            return '<?php if(auth()->guard(' + directive.getInnerContent() + ')->check()): ?>'
        }

        return '<?php if(auth()->guard()->check()): ?>'
    }
}