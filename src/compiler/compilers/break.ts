import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class BreakCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        if (directive.hasDirectiveParameters) {
            const value = parseInt(directive.getInnerContent());

            if (isNaN(value)) {
                return '<?php if(' + directive.getInnerContent() + ') break; ?>';
            } else {
                if (value < 0) {
                    return '<?php break 1; ?>';
                } else {
                    return '<?php break ' + value + '; ?>';
                }
            }
        }

        return '<?php break; ?>';
    }

}