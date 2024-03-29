import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class PhpDirectiveCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        if (directive.hasDirectiveParameters == false) {
            if (directive.isClosedBy == null) {
                return '@php';
            }

            return '<?php' + directive.documentContent;
        }

        return '<?php (' + directive.getInnerContent() + '); ?>';
    }
}