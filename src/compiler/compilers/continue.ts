import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';

export class ContinueCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        if (directive.hasDirectiveParameters) {
            const value = parseInt(directive.getInnerContent());

            if (isNaN(value)) {
                return '<?php if(' + directive.getInnerContent() + ') continue; ?>';
            } else {
                if (value < 0) {
                    return '<?php continue 1; ?>';
                } else {
                    return '<?php continue ' + value + '; ?>';
                }
            }
        }

        return '<?php continue; ?>';
    }

}