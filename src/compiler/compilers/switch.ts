import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class SwitchCompiler implements NodeCompiler {
    private lastCase: DirectiveNode | null = null;
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        let result = '<?php switch (' + directive.getInnerContent() + ')';

        const firstCase = directive.findFirstChildDirectiveOfType('case') as DirectiveNode;
        this.lastCase = firstCase;
        result += "\n";
        result += 'case (' + firstCase.getInnerContent() + '): ?>';

        return result;
    }

    getLastCase(): DirectiveNode | null {
        return this.lastCase;
    }
}