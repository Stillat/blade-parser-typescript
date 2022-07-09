import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';
import { SwitchCompiler } from './switch';

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