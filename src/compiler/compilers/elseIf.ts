import { AbstractNode, DirectiveNode } from '../../nodes/nodes';
import { NodeCompiler } from '../nodeCompiler';

export class ElseIfCompiler implements NodeCompiler {
    compile(node: AbstractNode): string {
        const directive = node as DirectiveNode;

        return '<? elseif(' + directive.getInnerContent() + '): ?>';
    }
}