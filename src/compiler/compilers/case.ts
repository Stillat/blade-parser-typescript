import { AbstractNode, DirectiveNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';
import { SwitchCompiler } from './switch.js';

export class CaseCompiler implements NodeCompiler {
    private switchCompiler: SwitchCompiler;

    constructor(switchCompiler: SwitchCompiler) {
        this.switchCompiler = switchCompiler;
    }

    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;


        if (directive == this.switchCompiler.getLastCase()) {
            return '';
        }

        return '<?php case(' + directive.getInnerContent() + '): ?>';
    }
}